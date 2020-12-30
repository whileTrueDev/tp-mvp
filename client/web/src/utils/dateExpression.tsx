import moment from 'moment';

interface makeDate {
  compoName: string;
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
      return (moment(createdAt).format('DD일 HH:mm ~ ') + moment(finishAt).format('DD일 HH:mm'));

    case 'highlight-table': return (moment(createdAt).format('YY-MM-DD HH:mm:ss'));

    case 'highlight-calendar': return (moment(createdAt).format('DD일 HH:mm ~ ') + moment(finishAt).format('DD일 HH:mm'));
    case 'table-view': return (moment(createdAt).format('ll'));

    case 'selected-view':
      if (((current.getTime() - postdate.getTime()) / 1000 / 3600 / 24) < 1) {
        return (moment(createdAt).startOf('day').fromNow());
      }
      return (moment(createdAt).format('lll'));

    default: return (moment(createdAt).format('ll'));
  }
}
