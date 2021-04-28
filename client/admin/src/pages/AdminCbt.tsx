import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import CbtSet from '../organisms/adminSet/CbtSet';

/*
AdminCbt
**********************************************************************************
<개요>
cbt 회원목록 관리 에대한 최상위 부모 컴포넌트 입니다.
<백엔드로요청>
 url: '/cbt/list', method: 'GET'
**********************************************************************************
1. 백엔드로 data get 요청을 보냅니다.
2. CbtSet이 위치합니다.
**********************************************************************************
 */
export default function AdminCbt(): JSX.Element {
  // 데이터 가져오기
  const [{ loading: cbtLoading, data: getData }, reload] = useAxios(
    { url: '/cbtinquiry', method: 'GET' },
  );
  useEffect(() => {
    reload();
  }, [reload]);
  return (<CbtSet tabledata={getData} cbtLoading={cbtLoading} reload={reload} />);
}
