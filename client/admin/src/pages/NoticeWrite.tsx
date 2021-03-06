import React from 'react';
import useAxios from 'axios-hooks';
import Writer from '../organisms/adminSet/writer/Writer';

/*
NoticeWrite
**********************************************************************************
<개요>
공지사항글 작성을위한 최상위 부모 컴포넌트 입니다.
<백엔드로요청>
url: '/notice', method: 'post'
**********************************************************************************
1. 백엔드로 data Post 요청을 보냅니다.
2. NoticeSet이 위치합니다.
**********************************************************************************
 */
export default function NoticeWrite(): JSX.Element {
  const [, reload] = useAxios(
    { url: '/notice', method: 'GET' },
  );
  function handleReload() {
    reload();
  }
  return (<Writer handleReload={handleReload} />);
}
