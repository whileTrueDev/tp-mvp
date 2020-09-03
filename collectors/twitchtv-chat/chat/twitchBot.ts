import tmi, { ChatUserstate } from 'tmi.js'; // For twitchChat socket server
import io from 'socket.io-client';

import connectDB from '../model/connectDB';
import WhileTrueScheduler from '../lib/scheduler';
import { ChatContainer } from '../interfaces/chat.interface';


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
 * 온애드 트위치 채팅 수집기 v2
 */
export default class TwitchBot {
  // Tmi Client
  private chatBotClient: tmi.Client | null;
  // List of joined channels
  private joinedChannels: Array<string> = [];
  // 가동 중 스케쥴러 목록
  private runningSchedulers: Array<WhileTrueScheduler> = [];
  // List of target streamers
  private creators: string[] = [];
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

        // badges?: Badges;
        // color?: string;
        // "display-name"?: string;
        // emotes?: { [emoteid: string]: string[] };
        // id?: string;
        // mod?: boolean;
        // turbo?: boolean;
        // 'emotes-raw'?: string;
        // 'badges-raw'?: string;
        // "room-id"?: string;
        // subscriber?: boolean;
        // 'user-type'?: "" | "mod" | "global_mod" | "admin" | "staff";
        // "user-id"?: string;
        // "tmi-sent-ts"?: string;
        // flags?: string;

        const data = {
          creatorId: userstate['room-id'],
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
        if (self) { // join event from the onad bot
          const channelName = channel.replace('#', '');
          console.log(`[${new Date().toLocaleString()}] join channel: ${channelName}`);
          this.joinedChannels.push(channelName);
        }
      },
    };
  }

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

  private getCreators(): void {
    connectDB.getContratedCreators()
      .then((allCreators) => { this.creators = allCreators; });
  }

  private addNewCreator(): void { // 새로운/정지된 크리에이터 채널에 입장 - 매일 0시 1분.
    console.log('=============== AddNewCreator ===============');
    // 새로운 크리에이터 채널 입장
    if (this.chatBotClient) {
      const channels = this.chatBotClient.getChannels().map((channel) => channel.replace('#', ''));
      const newCreators = this.creators.filter(
        (creator) => !(channels.includes(creator.creatorTwitchId))
      );

      newCreators.forEach((creator, idx) => {
        const anonFunc = (creator1: string): void => {
          setTimeout(() => {
            if (this.chatBotClient) {
              this.chatBotClient.join(creator1)
                .catch((err: any) => { console.log(`channel join error: ${err}`); });
            }
          }, idx * JOIN_TIMEOUT);
        };
        anonFunc(creator.creatorTwitchId);
      });
    }
  }

  private chatPeriodicInsert(): void { // 주기적 채팅로그 삽입 - 매 10분
    const { chatBuffer } = this.chatContainer;
    console.log('=================== Chat-autoInsert ====================');
    console.log('[TIME]: ', new Date().toLocaleString());
    console.log(`[Request Insert Rows]: ${chatBuffer.length} chats`);

    if (chatBuffer.length > 0) {
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

  runBot(): void {
    connectDB.getContratedCreators()
      .then((creators) => {
        this.creators = creators;
        const contractedChannels = creators.map((creator) => creator.creatorTwitchId);
        console.log(`contractedChannels : ${contractedChannels.length}`);
        const OPTION = {
          debug: true,
          connection: { reconnect: true, secure: true },
          identity: { username: BOT_NAME, password: BOT_OAUTH_TOKEN },
          channels: contractedChannels
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

  healthCheck(): void { // 로깅 및 헬스체크 - 1 or 5분 단위
    console.log('=================== healthCheck ====================');
    console.log('[TIME]: ', new Date().toLocaleString());
    console.log(`[Collecting channels]: ${this.joinedChannels.length}`);
    console.log(`[Get channels Length]: ${this.chatBotClient?.getChannels().length}`);
    console.log('[All chats on client]: ', this.chatContainer.chatCount);
    console.log('[Chats on collector buffer]: ', this.chatContainer.chatBuffer.length);
    console.log(`[Chats inserted]: ${this.chatContainer.insertedChatCount}`);
    console.log(`[Running Schedulers]: ${this.runningSchedulers.length}`);
  }

  runScheduler(): void {
    console.log('start schdulejobs!');
    const healthCheckScheduler = new WhileTrueScheduler(
      'healthcheck', '* * * * *', this.healthCheck.bind(this)
    );
    const addNewCreatorScheduler = new WhileTrueScheduler(
      'addnewcreator', '1 0 * * *', this.addNewCreator.bind(this)
    );
    const chatPeriodicInsertScheduler = new WhileTrueScheduler(
      'autoinsert', '*/10 * * * *', this.chatPeriodicInsert.bind(this)
    );
    const getCreatorsDataScheduler = new WhileTrueScheduler(
      'getCreatorsData', '5,15,25,35,45,55 * * * *', this.getCreators.bind(this)
    );

    this.runningSchedulers = [
      healthCheckScheduler,
      addNewCreatorScheduler,
      chatPeriodicInsertScheduler,
      getCreatorsDataScheduler
    ];
  }

  run(): void {
    // this.runBotTest();
    this.runBot();
    this.runScheduler();
  }
}
