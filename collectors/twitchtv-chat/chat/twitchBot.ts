import dotenv from 'dotenv';
import tmi, { ChatUserstate } from 'tmi.js'; // For twitchChat socket server
import mysql from 'mysql';
import connectDB from '../model/connectDB';
import WhileTrueScheduler from '../lib/scheduler';
import { ChatContainer, ChatFullInformation } from '../interfaces/chat.interface';
import { Streamer } from '../interfaces/streamer.interface';
import { Stream } from '../interfaces/stream.interface';
import msToTimeString from '../lib/msToTimeString';

dotenv.config();

// Configure constants
const BOT_NAME = 'onadyy';
const BOT_OAUTH_TOKEN = process.env.TWITCH_BOT_OAUTH_TOKEN; // onadyy
const JOIN_TIMEOUT = 8000;

interface Handlers {
  onConnectedHandler(address: string, port: number): void;
  onMessageHandler(channel: string, userstate: ChatUserstate, message: string, self: boolean): void;
  onDisconnectedHandler(reason: string): void;
  onJoinHandler(channel: string, username: string, self: boolean): void;
}
/**
 * 와일트루 트위치 채팅 수집기 v1
 */
export default class TwitchBot {
  // Tmi Client
  private chatBotClient: tmi.Client | null;
  // 가동 중 스케쥴러 목록
  private runningSchedulers: Array<WhileTrueScheduler> = [];
  // List of target streamers
  private streamers: Streamer[] = [];
  // List of current streams
  private streams: Stream[] = [];
  // Chat data container
  private chatContainer: ChatContainer = {
    chatCount: 0,
    insertedChatCount: 0,
    chatBuffer: [], // ... chats
  };;
  // List of tmi event handler
  private handlers: Handlers;

  constructor(private readonly pool: mysql.Pool) { // 인스턴스 속성 정의
    this.chatBotClient = null;
    this.handlers = {
      // Called every time connected with chat room
      onConnectedHandler: (addr, port): void => {
        console.log(`* Connected to ${addr}:${port}`);
      },
      // Called when Message is received
      onMessageHandler: (channel, userstate, msg, self): void => {
        if (self) { return; } // Ignore messages from the bot

        const data = {
          streamerId: userstate['room-id'],
          authorId: userstate['user-id'],
          authorName: userstate['display-name'],
          subscriber: userstate.subscriber,
          manager: userstate.mod,
          badges: userstate.badges,
          time: new Date(),
          text: msg,
        };
        // Insert to chatContainer
        this.chatContainer.chatCount += 1;
        this.chatContainer.chatBuffer.push(data);
      },
      // Called when client disconnected
      onDisconnectedHandler: (reason): void => {
        console.log(`Client Disconnected.. ${reason}`);
      },
      // Called when client join channel
      onJoinHandler: (channel, username, self): void => {
        if (self) { // join event from the WhileTrue bot
          const channelName = channel.replace('#', '');
          console.log(`[${new Date().toLocaleString()}] join channel: ${channelName}`);
        }
      },
    };
  }

  // Tmi Client 시작
  private startClient(OPTION: tmi.Options): void {
    const client = tmi.Client(OPTION);
    this.chatBotClient = client;
    if (this.chatBotClient) {
      this.chatBotClient.on('connected', this.handlers.onConnectedHandler);
      this.chatBotClient.on('join', this.handlers.onJoinHandler);
      this.chatBotClient.on('message', this.handlers.onMessageHandler);
      this.chatBotClient.on('disconnected', this.handlers.onDisconnectedHandler);
      this.chatBotClient.connect();
    }
  }

  // Target Streamer 가져오기
  private getStreamers(): Promise<Streamer[]> {
    return connectDB.getTargetStreamers(this.pool)
      .then((allStreamers) => {
        this.streamers = allStreamers;
        return allStreamers;
      });
  }

  // 현재 Stream 가져오기
  private getStreams(): Promise<Stream[]> {
    return connectDB.getCurrentStreams(this.pool)
      .then((streams) => {
        this.streams = streams;
        return streams;
      });
  }

  // 새로운/정지된 스트리머 채널에 입장 - 매일 0시 1분.
  private addNewStreamers(): void {
    console.log('=============== addNewStreamers ===============');
    if (this.chatBotClient) {
      const channels = this.chatBotClient.getChannels().map((channel) => channel.replace('#', ''));
      // 현재 접속되어 있지 않은 채널 필터링
      const newStreamers = this.streamers.filter(
        (streamer) => !(channels.includes(streamer.streamerChannelName))
      );
      if (newStreamers.length > 0) {
      // 새로운 스트리머 채널 입장
        newStreamers.forEach((streamer, idx) => {
          const anonFunc = (streamer1: string): void => {
            setTimeout(() => {
              if (this.chatBotClient) {
                this.chatBotClient.join(streamer1)
                  .then(() => {
                    console.log(`[${new Date().toLocaleString()}] join channel: `, streamer1);
                  })
                  .catch((err: any) => {
                    console.log(`[${new Date().toLocaleString()}] Error occurred when joinning channel: ${err}`, streamer1);
                  });
              }
            }, idx * JOIN_TIMEOUT);
          };
          anonFunc(streamer.streamerChannelName);
        });
      }
    }
  }

  // 주기적 채팅로그 삽입 - 매 10분
  private async chatPeriodicInsert(): Promise<void> {
    // Get current Stream data
    await this.getStreams();

    // Copy need to insert chats
    const insertChatBuffer = this.chatContainer.chatBuffer;
    // Cleanup current chatBuffer
    this.chatContainer.chatBuffer = [];
    if (insertChatBuffer.length > 0) {
      // ********************************************************
      // Logging
      console.log('=================== Chat-autoInsert ====================');
      console.log('[TIME]: ', new Date().toLocaleString());
      console.log(`[Request Insert Rows]: ${insertChatBuffer.length} chats`);

      // ********************************************************
      // chat 데이터에 streamId 및 playtime 부여
      const chatsFullInfo = insertChatBuffer.map((chat): ChatFullInformation => {
        const targetStream = this.streams.find((stream) => stream.streamerId === chat.streamerId);
        if (targetStream) {
          return {
            ...chat,
            streamId: targetStream?.streamId,
            playtime: msToTimeString(
              chat.time.getTime() - new Date(targetStream?.startedAt).getTime()
            )
          };
        }
        return chat;
      });
      // ********************************************************
      // 채팅 데이터 적재
      connectDB.insertChats(this.pool, chatsFullInfo)
        .then((result) => {
          // result = db OKPacket
          this.chatContainer.insertedChatCount += result.affectedRows;
          console.log(`[Successfully Inserted Rows]: ${result.affectedRows} chats`);
        })
        .catch((err) => {
          console.log(`[DB Error occurred during Chat Insertion]: ${err}`);
        });
    } else {
      console.log('[Skip!..]: 채팅데이터없음');
    }
  }

  // 로깅 및 헬스체커 - 1 or 5분 단위
  private healthCheck(): void {
    console.log('=================== healthCheck ====================');
    console.log('[TIME]: ', new Date().toLocaleString());
    console.log('[Collecting channels]: ', this.chatBotClient?.getChannels().length);
    console.log('[All chats deal on client]: ', this.chatContainer.chatCount);
    console.log('[Chats on collector buffer]: ', this.chatContainer.chatBuffer.length);
    console.log('[Chats inserted]: ', this.chatContainer.insertedChatCount);
    console.log('[Running Schedulers]: ', this.runningSchedulers.length);
  }

  runBot(): void {
    this.getStreamers()
      .then((streamers) => {
        this.streamers = streamers;
        const targetChannels = streamers.map((streamer) => streamer.streamerChannelName);
        console.log(`targetChannels : ${targetChannels.length}`);
        const OPTION = {
          debug: true,
          connection: { reconnect: true, secure: true },
          identity: { username: BOT_NAME, password: BOT_OAUTH_TOKEN },
          channels: targetChannels
        };

        this.startClient(OPTION);
      })
      .catch((err) => {
        console.log('error in getStreams', err);
      });
  }

  runBotTest(): void {
    const OPTION = {
      debug: true,
      connection: { reconnect: true, secure: true },
      identity: { username: BOT_NAME, password: BOT_OAUTH_TOKEN },
      channels: ['iamsupermazinga'] // 'oxquizzz', 'kevin20222'
    };
    this.startClient(OPTION);
  }

  runScheduler(): void {
    const healthCheckScheduler = new WhileTrueScheduler(
      'healthcheck', '* * * * *', this.healthCheck.bind(this)
    );
    const chatPeriodicInsertScheduler = new WhileTrueScheduler(
      'autoinsert', '*/10 * * * *', this.chatPeriodicInsert.bind(this)
    );
    const getStreamersDataScheduler = new WhileTrueScheduler(
      'getStreamersData', '5,25,45 * * * *', this.getStreamers.bind(this)
    );
    const addNewStreamerScheduler = new WhileTrueScheduler(
      'addnewstreamers', '30 * * * *', this.addNewStreamers.bind(this)
    );

    this.runningSchedulers = [
      healthCheckScheduler,
      addNewStreamerScheduler,
      chatPeriodicInsertScheduler,
      getStreamersDataScheduler,
    ];
    console.log('Successfully Started schdulejobs !!');
  }

  async run(): Promise<void> {
    this.runBot();
    this.runScheduler();
  }
}
