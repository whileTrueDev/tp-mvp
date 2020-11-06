import moment from 'moment';

interface makeDate {
  pagename: string;
  createdAt: any;
}
export default function MakedateForm(data: makeDate): any {
  const { pagename, createdAt } = data;
  const postdate = new Date(createdAt);
  const current = new Date();

  if (((current.getTime() - postdate.getTime()) / 1000 / 3600 / 24) < 1 && pagename === 'selected-view') {
    return (moment(createdAt).startOf('day').fromNow());
  }
  switch (pagename) {
    case 'table-view': return (moment(createdAt).format('ll'));
    case 'selected-view': return (moment(createdAt).format('lll'));
    default: return (moment(createdAt).format('ll'));
  }
}
