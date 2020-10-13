import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SlackMessageParam } from './interfaces/slack.interface';

@Injectable()
export class SlackService {
  private readonly url: string;

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get<string>('SLACK_ALARM_URL');
  }

  private cutLongText(text: string, len = 30): string {
    return text.length >= len ? `${text.slice(0, len)}...` : text;
  }

  /**
   * @example
   * slack({
      summary: '크리에이터 정산 등록 알림',
      text: '크리에이터가 정산을 등록했습니다. 확인해주세요.',
      fields: [
        { title: '크리에이터 아이디', value: creatorId!, short: true },
        { title: '은행', value: bankName!, short: true },
      ]
    });
   */
  public async message({ title, text, fields }: SlackMessageParam): Promise<string> {
    const sendingFields = fields.map(
      (field) => ({ ...field, value: this.cutLongText(field.value) }),
    );

    try {
      const res = await axios.post(this.url, JSON.stringify({
        attachments: [{
          fallback: `[Truepoint] ${title}`,
          pretext: `[Truepoint] ${title}`,
          text: `[Truepoint] ${this.cutLongText(text)}`,
          fields: sendingFields,
          color: '#929ef8',
          title: '[Truepoint] 관리자 페이지 바로가기',
          title_link: 'https://admin.mytruepoint.com',
          footer: 'TruePoint Slack Bot',
          footerIcon: 'https://platform.slack-edge.com/img/default_application_icon.png',
        }],
      }), { withCredentials: true });
      if (res) { return res.data; }
      return 'fail';
    } catch (err) {
      return 'Error occurred during posting slack messages';
    }
  }
}
