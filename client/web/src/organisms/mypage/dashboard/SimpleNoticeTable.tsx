import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const rows = [
  {
    id: 1, category: '업데이트', title: '트루포인트 리뉴얼 안내', createdAt: new Date(),
  },
  {
    id: 2, category: '업데이트', title: '트루포인트 리뉴얼 안내', createdAt: new Date(),
  },
  {
    id: 3, category: '공지사항', title: '트루포인트의 공지사항입니다 꼭 확인해주시면 좋겠다리다리두', createdAt: new Date(),
  },
  {
    id: 4, category: '업데이트', title: '트루포인트 리뉴얼 안내', createdAt: new Date(),
  },
  {
    id: 5, category: '긴급점검', title: '오늘은 점검으로 서버 닫힘닙낟', createdAt: new Date(),
  },
];

export default function SimpleNoticeTable():JSX.Element {
  const classes = useStyles();
  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>공지사항</Typography>
      </div>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="notice table" size="medium">
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} style={{ cursor: 'pointer' }} hover onClick={() => { alert(`공지사항 ${row.id}번`); }}>
                <TableCell width={150} scope="row" component="th" align="left">{row.category}</TableCell>
                <TableCell align="left">{row.title}</TableCell>
                <TableCell width={200} align="right">{row.createdAt.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
