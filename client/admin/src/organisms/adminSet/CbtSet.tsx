import { Typography } from '@material-ui/core';
import React from 'react';
// organisms
import CbtTable from './table/CbtTable';

/*
dataprops
**********************************************************************************
<개요>
CbtSet 위한 props입니다.
**********************************************************************************
tabledata (optional) : 공지사항 데이터를 전달받는 속성값입니다.
cbtLoading (optional) : cbt 관리하기에대한 백엔드 요청에대한 loading상태를 관리하는 속성값입니다.
reload : 공지사항 글목록 변경사항을 랜더링하기위한 핸들러함수를 전달받습니다.
**********************************************************************************
 */
interface dataprops {
  tabledata?: any;
  cbtLoading?: any;
  reload: () => void;
}
/*
CbtSet
**********************************************************************************
<개요>
cbt 회원목록을 보여주는 컴포넌트 입니다.
**********************************************************************************
1. CbtSet : Cbt 테이블과 회원가입하기 dialog가 모여있는 부모 컴포넌트입니다.
2. Cbt텝에서는 cbt 회원목록, 회원등록 dialog 컴포넌트가 있습니다.
3. 게재할 목록 Table에대한 data를 이 컴포넌트의 부모 컴포넌트에서 백엔드로부터 get 요청한후 받은 데이터를
  table에 렌더링합니다.
**********************************************************************************
 */
export default function CbtSet(data: dataprops): JSX.Element {
  const { tabledata, cbtLoading } = data;

  if (cbtLoading) {
    return (
      <div style={{ padding: 28 }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h5">
        Cbt 관리
      </Typography>
      <CbtTable tableData={tabledata} />
    </div>
  );
}
