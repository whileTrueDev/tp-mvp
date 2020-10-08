import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import {
  TableFooter, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, Paper
} from '@material-ui/core';
import { FiberNew } from '@material-ui/icons';
import TablePaginationActions from '../../../atoms/Table/TablePaginationActions';
import { NoticeData } from '../../../interfaces/Notice';

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

export interface NoticeTableProps<T> {
  data: T[];
  onRowClick: (num:number) => void;
}
export default function NoticeTable<T extends NoticeData>({
  data,
  onRowClick,
}: NoticeTableProps<T>): JSX.Element {
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

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead className={classes.tableheader}>
          <TableRow className={classes.tableRow}>
            <TableCell className={classes.tableheaderCell} align="center" width={125}>글번호</TableCell>
            <TableCell className={classes.tableheaderCell} align="center" width={250}>카테고리</TableCell>
            <TableCell className={classes.tableheaderCell} align="center">제목</TableCell>
            <TableCell className={classes.tableheaderCell} align="center" width={250}>작성일</TableCell>
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
                  hover={!row.isImportant}
                  key={row.id}
                  className={classnames({
                    [classes.tableRow]: true, [classes.important]: row.isImportant
                  })}
                >
                  <TableCell align="center" component="th" scope="row">
                    <Typography>{row.isImportant ? '중요공지' : row.id}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography>{row.category}</Typography>
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
                </TableRow>
              );
            })}
          {emptyRows > 0 && (
            <TableRow hover style={{ height: 80 * emptyRows }}>
              <TableCell colSpan={5} />
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
              colSpan={5}
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
