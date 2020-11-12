import moment from 'moment';

interface makeDate {
  compoName: string;
  createdAt: any;
  streamAirtime?: any;
  finishAt?: any;
}

export default function dateExpression(data: makeDate): any {
  const {
    compoName, createdAt, streamAirtime, finishAt,
  } = data;
  const postdate = new Date(createdAt);
  const current = new Date();
  const end = new Date(createdAt);

  switch (compoName) {
    case 'analysys-calender':
      end.setHours(createdAt.getHours() + streamAirtime);
      return (moment(createdAt).format('DD일 HH:mm ~ ') + moment(end).format('DD일 HH:mm'));

    case 'highlight-table': return (moment(createdAt).format('YY-MM-DD HH:mm:ss'));

    case 'highlight-calendar': return (`${`${String(createdAt).slice(2, 4)}일  ${createdAt.slice(4, 6)}:${createdAt.slice(6, 8)}`} ~ ${String(finishAt).slice(2, 4)}일  ${`${finishAt.slice(4, 6)}:${finishAt.slice(6, 8)}`}`);

    case 'table-view': return (moment(createdAt).format('ll'));

    case 'selected-view':
      if (((current.getTime() - postdate.getTime()) / 1000 / 3600 / 24) < 1) {
        return (moment(createdAt).startOf('day').fromNow());
      }
      return (moment(createdAt).format('lll'));

    default: return (moment(createdAt).format('ll'));
  }
}
