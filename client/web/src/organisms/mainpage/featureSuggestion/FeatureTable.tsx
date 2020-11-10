import React from 'react';
import moment from 'moment';
import {
  TablePagination, TableCell, TableRow, TableBody, Chip, Typography,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import shortid from 'shortid';
import Table from '../../../atoms/Table/MaterialTable';
import transformIdToAsterisk from '../../../utils/transformAsterisk';
import useAuthContext from '../../../utils/hooks/useAuthContext';

const TABLE_ROW_HEIGHT = 45;
const useStyles = makeStyles((theme) => ({
  tableRow: {
    height: TABLE_ROW_HEIGHT,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  tableCell: { padding: theme.spacing(1) },
  commentCount: { marginLeft: theme.spacing(1), fontWeight: 'bold' },
}));

export interface TableProps {
  metrics: any;
  page: number;
  pageSize: number;
  handlePage: any;
  handlePageSize: any;
  handleClick: (a: any) => void;
}
export default function MaterialTable({
  metrics,
  handleClick,
  page,
  pageSize,
  handlePage,
  handlePageSize,
}: TableProps): JSX.Element {
  const emptyRows = pageSize - Math.min(pageSize, metrics.length - page * pageSize);
  const classes = useStyles();
  const theme = useTheme();

  // 현재 사용자와 기능제안 글쓴이가 같은 사람인지 체크하기 위해
  const auth = useAuthContext();

  const progressColumn = (value: number) => {
    switch (value) {
      case 1: return (<Chip color="secondary" label="개발 확정" />);
      case 2: return (<Chip color="primary" label="개발보류" />);
      default: return (<Chip variant="outlined" label="미확인" />);
    }
  };

  return (
    <>
      <Table
        columns={[
          {
            width: '50px',
            align: 'center',
            title: ' ',
          },
          {
            width: '150px',
            align: 'center',
            title: '카테고리',
          },
          {
            width: '150px',
            align: 'center',
            title: '작성자',
          },
          {
            width: '300px',
            align: 'center',
            title: '제목',
          },
          {
            width: '200px',
            align: 'center',
            title: '작성일',
          },
          {
            width: '150px',
            align: 'center',
            title: '진행상태',
          },
        ]}
        data={metrics || []}
        components={{
          Pagination: (props) => (
            <TablePagination
              {...props}
              page={page}
            />
          ),
          Body: () => (
            <TableBody>
              {(pageSize > 0
                ? metrics.slice(page * pageSize, page * pageSize + pageSize)
                : metrics
              ).map((eachRow: any) => (
                <TableRow
                  className={classes.tableRow}
                  key={shortid.generate()}
                  onClick={() => handleClick(eachRow.suggestionId)}
                >
                  <TableCell className={classes.tableCell} scope="row" align="center">
                    {eachRow.suggestionId}
                  </TableCell>
                  <TableCell className={classes.tableCell} scope="row" align="center">
                    {eachRow.category}
                  </TableCell>
                  <TableCell className={classes.tableCell} scope="row" align="center">
                    {auth.user.userId === eachRow.author
                      ? eachRow.author
                      : transformIdToAsterisk(eachRow.author, 1.8)}
                  </TableCell>
                  <TableCell className={classes.tableCell} scope="row" align="left">
                    <div>
                      {eachRow.title}
                      {eachRow.replies.length > 0 && (
                      <Typography variant="caption" color="primary" className={classes.commentCount} component="span">
                        {`(${eachRow.replies.length})`}
                      </Typography>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={classes.tableCell} scope="row" align="center">
                    {moment(eachRow.createdAt).format('YYYY년 MM월 DD일')}
                  </TableCell>
                  <TableCell className={classes.tableCell} scope="row" align="center">
                    {progressColumn(eachRow.state)}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: TABLE_ROW_HEIGHT * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          ),
        }}
        onChangePage={handlePage}
        onChangeRowsPerPage={handlePageSize}
        options={{
          toolbar: false,
          sorting: false,
          search: false,
          pageSize,
          pageSizeOptions: [8, 12],
          headerStyle: { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText },
          draggable: false,
          paginationType: 'stepped',
        }}
        style={{ boxShadow: 'none' }}
      />
    </>
  );
}
