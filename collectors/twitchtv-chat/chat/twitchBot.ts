import tmi, { ChatUserstate } from 'tmi.js'; // For twitchChat socket server
import connectDB from '../model/connectDB';
import WhileTrueScheduler from '../lib/scheduler';
import { ChatContainer } from '../interfaces/chat.interface';
import { Streamer } from '../interfaces/streamer.interface';
import { Stream } from '../interfaces/stream.interface';


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
  // List of joined channels
  private joinedChannels: Array<string> = [];
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

  constructor() { // 인스턴스 속성 정의
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
          time: new Date(),
          name: userstate['display-name'],
          userid: userstate['user-id'],
          subscriber: userstate.subscriber,
          manager: userstate.mod,
          badges: userstate.badges,
          text: msg
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
          this.joinedChannels.push(channelName);
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
  private getStreamers(): void {
    connectDB.getTargetStreamers()
      .then((allStreamers) => { this.streamers = allStreamers; });
  }

  // Stream 가져오기
  private getStreams(): void {
    connectDB.getCurrentStreams()
      .then((streams) => { this.streams = streams; });
  }

  // 새로운/정지된 크리에이터 채널에 입장 - 매일 0시 1분.
  private addNewStreamers(): void {
    console.log('=============== addNewStreamers ===============');
    // 새로운 크리에이터 채널 입장
    if (this.chatBotClient) {
      const channels = this.chatBotClient.getChannels().map((channel) => channel.replace('#', ''));
      const newStreamers = this.streamers.filter(
        (streamer) => !(channels.includes(streamer.streamerChannelName))
      );

      newStreamers.forEach((streamer, idx) => {
        const anonFunc = (streamer1: string): void => {
          setTimeout(() => {
            if (this.chatBotClient) {
              this.chatBotClient.join(streamer1)
                .catch((err: any) => { console.log(`channel join error: ${err}`); });
            }
          }, idx * JOIN_TIMEOUT);
        };
        anonFunc(streamer.streamerChannelName);
      });
    }
  }

  // 주기적 채팅로그 삽입 - 매 10분
  private async chatPeriodicInsert(): Promise<void> {
    const { chatBuffer } = this.chatContainer;
    console.log('=================== Chat-autoInsert ====================');
    console.log('[TIME]: ', new Date().toLocaleString());
    console.log(`[Request Insert Rows]: ${chatBuffer.length} chats`);

    if (chatBuffer.length > 0) {
      // ********************************************************
      // chat 데이터에 streamId 및 playtime 부여
      // 매 수집된 채팅 데이터 삽입 이전에 최신화된 Stream 데이터에서
      // streamerId 기준으로 찾아 알맞은 Stream을 찾아 streamId를 넣고,
      // 해당 Stream의 startedAt 시간을 기준으로
      // playtime을 생성한 이후 데이터 적재.
      // ********************************************************
      console.log(this.streams[0].startedAt);
      console.log(this.streams[0].streamId);
      console.log(this.streams[0].streamerName);

      connectDB.insertChats(chatBuffer)
        .then((result) => {
          // result = db OKPacket
          this.chatContainer.insertedChatCount += result.affectedRows;
          console.log(`[Successfully Inserted Rows]: ${result.affectedRows} chats`);
          // cleanup chatBuffer
          this.chatContainer.chatBuffer = [];
        })
        .catch((err) => {
          console.log(`[DB error]: ${err}`);
        });
    } else {
      console.log('[Skip!..]: 채팅데이터없음');
    }
  }

  // 로깅 및 헬스체크 - 1 or 5분 단위
  private healthCheck(): void {
    console.log('=================== healthCheck ====================');
    console.log('[TIME]: ', new Date().toLocaleString());
    console.log(`[Collecting channels]: ${this.joinedChannels.length}`);
    console.log(`[Get channels Length]: ${this.chatBotClient?.getChannels().length}`);
    console.log('[All chats deal on client]: ', this.chatContainer.chatCount);
    console.log('[Chats on collector buffer]: ', this.chatContainer.chatBuffer.length);
    console.log(`[Chats inserted]: ${this.chatContainer.insertedChatCount}`);
    console.log(`[Running Schedulers]: ${this.runningSchedulers.length}`);
  }

  runBot(): void {
    connectDB.getTargetStreamers()
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
    console.log('start schdulejobs!');
    const healthCheckScheduler = new WhileTrueScheduler(
      'healthcheck', '* * * * *', this.healthCheck.bind(this)
    );
    const addNewStreamerScheduler = new WhileTrueScheduler(
      'addnewstreamers', '1 0 * * *', this.addNewStreamers.bind(this)
    );
    const chatPeriodicInsertScheduler = new WhileTrueScheduler(
      'autoinsert', '*/10 * * * *', this.chatPeriodicInsert.bind(this)
    );
    const getStreamsDataScheduler = new WhileTrueScheduler(
      'getStreamsData', '8,18,28,38,48,58 * * * *', this.getStreams.bind(this)
    );
    const getStreamersDataScheduler = new WhileTrueScheduler(
      'getStreamersData', '5,15,25,35,45,55 * * * *', this.getStreamers.bind(this)
    );

    this.runningSchedulers = [
      healthCheckScheduler,
      addNewStreamerScheduler,
      chatPeriodicInsertScheduler,
      getStreamsDataScheduler,
      getStreamersDataScheduler,
    ];
  }

  run(): void {
    // this.runBotTest();
    this.runBot();
    this.runScheduler();
  }
}
