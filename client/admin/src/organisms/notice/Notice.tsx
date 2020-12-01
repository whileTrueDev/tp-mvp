import React from 'react';
import useAxios from 'axios-hooks';
import NoticeSet from '../adminSet/NoticeSet';

export default function Notice(): JSX.Element {
  // 데이터 가져오기
  const [{ loading: noticeLoading, data: getData }, reload] = useAxios(
    { url: 'http://localhost:3000/notice', method: 'GET' },
  );

  return (<NoticeSet tabledata={getData} noticeLoading={noticeLoading} reload={reload} />);
}
