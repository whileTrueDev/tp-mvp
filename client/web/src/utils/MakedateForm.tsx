import moment from 'moment';

interface makeDate {
  pagename: string;
  createdAt: any;
  streamAirtime?: any;
}

export default function MakedateForm(data: makeDate): any {
  const { pagename, createdAt, streamAirtime } = data;
  const postdate = new Date(createdAt);
  const current = new Date();

  if (((current.getTime() - postdate.getTime()) / 1000 / 3600 / 24) < 1 && pagename === 'selected-view') {
    return (moment(createdAt).startOf('day').fromNow());
  }

  if (pagename === 'calendar') {
    const end = new Date(createdAt);
    end.setHours(createdAt.getHours() + streamAirtime);
    const airTimeText = `${createdAt.getDate()}일 ${moment(createdAt).format('HH:mm')} ~ ${end.getDate()}일 ${moment(end).format('HH:mm')}`;
    return (airTimeText);
  }
  if (pagename === 'highlight-calendar') {
    const returnText = `${createdAt.getDate()}일 ${moment(createdAt).format('HH:mm')} ~ ${streamAirtime.getDate()}일 ${moment(streamAirtime).format('HH:mm')}`;
    return returnText;
  }
  switch (pagename) {
    case 'table-view': return (moment(createdAt).format('ll'));
    case 'selected-view': return (moment(createdAt).format('lll'));
    default: return (moment(createdAt).format('ll'));
  }
}
