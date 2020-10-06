import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import {
  TableFooter, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, Paper
} from '@material-ui/core';
import { FiberNew } from '@material-ui/icons';
import TablePaginationActions from '../../../atoms/Table/TablePaginationActions';
import { FeatureData } from '../../../interfaces/Feature';

const useStyles = makeStyles((theme) => ({
  container: { boxShadow: 'none' },
  table: { minWidth: 650, },
  tableheader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  tableRow: { height: 80, },
  tablefooterRow: { height: 40 },
  important: {
    backgroundColor: theme.palette.action.hover,
    '&:hover': {
      backgroundColor: theme.palette.primary.light
    }
  },
  tableheaderCell: { color: theme.palette.common.white, fontWeight: 'bold', },
  linkText: {
    display: 'flex',
    alignItems: 'center',
    textTransform: 'none',
    textDecoration: 'none',
    color: theme.palette.text.primary,
    cursor: 'pointer',
  },
  newIcon: { marginLeft: theme.spacing(1) }
}));

export interface FeatureTable<T> {
  data: T[];
  onRowClick: (num: number) => void;
}
export default function FeatureTable<T extends FeatureData>({
  data,
  onRowClick,
}: FeatureTable<T>): JSX.Element {
  const classes = useStyles();

  // For "NEW" flag
  const daysAgo7 = new Date();
  daysAgo7.setDate(daysAgo7.getDate() - 7);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = rowsPerPage - Math.min(
    rowsPerPage, data.length - page * rowsPerPage
  );

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const categoryTab = (value: number) => {
    switch (value) {
      case 0: return (<Typography> 홈페이지관련 </Typography>);
      case 1: return (<Typography> 편집점관련 </Typography>);
      case 2: return (<Typography> 기타 </Typography>);
      default: return (<Typography> 기타 </Typography>);
    }
  };
  const progressTab = (value: number) => {
    switch (value) {
      case 1: return (<Typography> 개발확정 </Typography>);
      case 2: return (<Typography> 개발보류 </Typography>);
      default: return (<Typography> 미확인 </Typography>);
    }
  };

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead className={classes.tableheader}>
          <TableRow className={classes.tableRow}>
            <TableCell className={classes.tableheaderCell} align="center" width={125}>글번호</TableCell>
            <TableCell className={classes.tableheaderCell} align="center" width={200}>카테고리</TableCell>
            <TableCell className={classes.tableheaderCell} align="center">작성자</TableCell>
            <TableCell className={classes.tableheaderCell} align="center">제목</TableCell>
            <TableCell className={classes.tableheaderCell} align="center" width={250}>작성일</TableCell>
            <TableCell className={classes.tableheaderCell} align="center" width={150}>진행상태</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          )
            .map((row) => {
              const createdAt = new Date(row.createdAt);
              const isNew = createdAt.getTime() > daysAgo7.getTime();
              return (
                <TableRow
                  key={row.id}
                  className={classnames({
                    [classes.tableRow]: true
                  })}
                >
                  <TableCell align="center">
                    <Typography>{row.id}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    {categoryTab(Number(row.category))}
                  </TableCell>
                  <TableCell align="center">
                    <Typography>{row.author}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      onClick={() => { onRowClick(row.id); }}
                      className={classes.linkText}
                    >
                      {row.title}
                      {isNew ? <FiberNew fontSize="large" className={classes.newIcon} color="secondary" /> : ''}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography>{createdAt.toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    {progressTab(Number(row.progress))}
                  </TableCell>
                </TableRow>
              );
            })}
          {emptyRows > 0 && (
            <TableRow hover style={{ height: 80 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow className={classes.tablefooterRow}>
            <TablePagination
              backIconButtonText="이전 페이지"
              nextIconButtonText="다음 페이지"
              labelDisplayedRows={({
                from, to, count
              }) => `${count}개 중, ${from} ~ ${to}개`}
              rowsPerPageOptions={[]}
              colSpan={6}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>

    </TableContainer>
  );
}
