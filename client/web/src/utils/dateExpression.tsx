import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);
interface makeDate {
  compoName?: string;
  createdAt: any;
  finishAt?: any;
}

export function dayjsFormatter(date?: string | Date | null | undefined, format?: 'default' | 'date-only' | string): any {
  if (date) {
    switch (format) {
      case 'default':
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss');

      case 'date-only':
        return dayjs(date).format('YYYY-MM-DD');

      default:
        if (format) {
          return dayjs(date).format(format);
        }
        return dayjs(date);
    }
  }
  return dayjs();
}

export default function dateExpression(data: makeDate): any {
  const {
    compoName, createdAt, finishAt,
  } = data;
  const postdate = new Date(createdAt);
  const current = new Date();
  switch (compoName) {
    case 'analysys-calender':
      return (dayjs(createdAt).format('DD일 HH:mm ~ ') + dayjs(finishAt).format('DD일 HH:mm'));

    case 'highlight-calendar': {
      return (dayjs(createdAt).format('DD일 HH:mm ~ ') + dayjs(finishAt).format('DD일 HH:mm'));
    }

    case 'selected-view':
      if (((current.getTime() - postdate.getTime()) / 1000 / 3600 / 24) < 1) {
        return (dayjs(createdAt).startOf('day').fromNow());
      }
      return (dayjs(createdAt).format('lll'));

    default: return (dayjs(createdAt).format('ll'));
  }
}
