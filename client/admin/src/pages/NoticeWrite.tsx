import React from 'react';
import useAxios from 'axios-hooks';
import Writer from '../organisms/adminSet/writer/Writer';

export default function NoticeWrite(): JSX.Element {
  const [, reload] = useAxios(
    { url: 'http://localhost:3000/notice', method: 'GET' },
  );
  function handleReload() {
    reload();
  }
  return (<Writer handleReload={handleReload} />);
}
