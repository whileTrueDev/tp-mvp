import React from 'react';
import {
  TableRow, TableCell, TableBody,
} from '@material-ui/core';

/* 
  costomTableProps
  ***************************************************************
  CostomTableRow를 위한 프롭스입니다.
  ***************************************************************
  1. title : 제목
  2. data : 데이터
  ***************************************************************

*/
interface costomTableProps {
  title: string;
  data?: string;
}
/* 
  CostomTableRow
  ***************************************************************
  <개요>
  데이터 개별보기 컴포넌트에 간단한 테이블형태의 layout을 만드는 컴포넌트입니다.
  ***************************************************************
  1. title, data 제목과 데이터를 행을 구분하여 보여줍니다.
  ***************************************************************

*/
function CostomTableRow(props: costomTableProps): JSX.Element {
  const { title, data } = props;

  return (
    <TableBody>
      <TableRow>
        <TableCell>
          {title}
        </TableCell>
        <TableCell>
          {data}
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

export default CostomTableRow;
