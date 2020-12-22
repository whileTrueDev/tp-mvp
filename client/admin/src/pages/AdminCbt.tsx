import React from 'react';
import useAxios from 'axios-hooks';
import CbtSet from '../organisms/adminSet/CbtSet';

export default function AdminCbt(): JSX.Element {
  // 데이터 가져오기
  const [{ loading: cbtLoading, data: getData }, reload] = useAxios(
    { url: 'http://localhost:3000/cbt/list', method: 'GET' },
  );

  return (<CbtSet tabledata={getData} cbtLoading={cbtLoading} reload={reload} />);
}
