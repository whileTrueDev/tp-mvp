import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.locale('ko');
dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);
interface makeDate {
  compoName?: string;
  createdAt: any;
  finishAt?: any;
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

    case 'highlight-table': return (dayjs(createdAt).format('YY-MM-DD HH:mm:ss'));

    case 'highlight-calendar': return (dayjs(createdAt).format('DD일 HH:mm ~ ') + dayjs(finishAt).format('DD일 HH:mm'));
    case 'table-view': return (dayjs(createdAt).format('ll'));

    case 'selected-view':
      if (((current.getTime() - postdate.getTime()) / 1000 / 3600 / 24) < 1) {
        return (dayjs(createdAt).startOf('day').fromNow());
      }
      return (dayjs(createdAt).format('lll'));

    case 'fromNow':
      return dayjs(createdAt).fromNow();

    case 'post-date': return (dayjs(createdAt).format('YY-MM-DD HH:mm:ss'));

    default: return (dayjs(createdAt).format('ll'));
  }
}
