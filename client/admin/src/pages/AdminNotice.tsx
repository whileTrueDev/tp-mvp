import React from 'react';
import useAxios from 'axios-hooks';
import NoticeSet from '../organisms/adminSet/NoticeSet';

/*
Notice
**********************************************************************************
<개요>
공지사항 에대한 최상위 부모 컴포넌트 입니다.
<백엔드로 요청>
url: '/notice', method: 'GET'
**********************************************************************************
1. 백엔드로 data get 요청을 보냅니다.
2. NoticeSet이 위치합니다.
**********************************************************************************
 */
export default function Notice(): JSX.Element {
  // 데이터 가져오기
  const [{ loading: noticeLoading, data: getData }, reload] = useAxios(
    { url: '/notice', method: 'GET' },
  );

  return (<NoticeSet tabledata={getData} noticeLoading={noticeLoading} reload={reload} />);
}
