import moment from 'moment';

interface makeDate {
  compoName: string;
  createdAt: any;
  streamAirtime?: any;
  finishAt?: any;
}

export default function makedateForm(data: makeDate): any {
  const {
    compoName, createdAt, streamAirtime, finishAt,
  } = data;
  const postdate = new Date(createdAt);
  const current = new Date();

  /*
    방송분석탭 달력의 listItem에 들어가는 날짜포맷
   */
  if (compoName === 'calendar') {
    const end = new Date(createdAt);
    end.setHours(createdAt.getHours() + streamAirtime);
    return (moment(createdAt).format('DD일 HH:mm ~ ') + moment(end).format('DD일 HH:mm'));
  }
  /* 
    편집점분석탭에서의 달력밑의 table에 들어나는 날짜포맷
  */
  if (compoName === 'highlight-table') {
    return (moment(createdAt).format('YY-MM-DD HH:mm:ss'));
  }
  /*
     편집점분석탭 달력의 listItem에 들어가는 날짜포맷
   */
  if (compoName === 'highlight-calendar') {
    return (moment(createdAt).format('DD일 HH:mm ~') + moment(finishAt).format('DD일 HH:mm'));
  }

  /*
    공지사항, 기능제안 의 개별보기 페이지에서 작성된지 1일이 지나지 않은경우에 쓰이는 날짜포맷
   */
  if (((current.getTime() - postdate.getTime()) / 1000 / 3600 / 24) < 1 && compoName === 'selected-view') {
    return (moment(createdAt).startOf('day').fromNow());
  }
  /*
    기능제안, 공지사항 테이블의 날짜포맷 : table-view
    기능제안, 공지사항 개별보기의 날짜포맷 : selected-view
   */
  switch (compoName) {
    case 'table-view': return (moment(createdAt).format('ll'));
    case 'selected-view': return (moment(createdAt).format('lll'));
    default: return (moment(createdAt).format('ll'));
  }
}
