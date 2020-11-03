import React from 'react';
import classnames from 'classnames';
import {
  TablePagination, TableCell, TableRow, TableBody,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import shortid from 'shortid';
import Table from '../../../atoms/Table/MaterialTable';

interface TableProps {
  metrics: any;
  page: number;
  pageSize: number;
  handlePage: any;
  handlePageSize: any;
  handleClick: (a: any) => void;
  categoryTabSwitch: (value: string | undefined) => JSX.Element;
}
const useStyles = makeStyles((theme) => ({
  tableCell: { padding: 10 },
  tableRow: {
    height: 80,
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  important: {
    backgroundColor: theme.palette.success.light,
  },
}));
export default function MaterialTable({
  metrics,
  handleClick,
  page,
  pageSize,
  handlePage,
  handlePageSize,
  categoryTabSwitch,
}: TableProps): JSX.Element {
  const classes = useStyles();
  const emptyRows = pageSize - Math.min(pageSize, metrics.length - page * pageSize);

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
            width: '200px',
            align: 'center',
            title: '카테고리',
          },
          {
            width: '200px',
            align: 'center',
            title: '제목',
          },
          {
            width: '300px',
            align: 'center',
            title: '작성일',
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
                  key={shortid.generate()}
                  onClick={() => handleClick(eachRow.id)}
                  className={classnames({
                    [classes.tableRow]: true, [classes.important]: eachRow.isImportant,
                  })}
                >
                  <TableCell className={classes.tableCell} component="th" scope="row" align="center">
                    {eachRow.isImportant ? '중요' : eachRow.id}
                  </TableCell>
                  <TableCell className={classes.tableCell} component="th" scope="row" align="center">
                    {categoryTabSwitch(eachRow.category)}
                  </TableCell>
                  <TableCell className={classes.tableCell} component="th" scope="row" align="center">
                    {eachRow.title}
                  </TableCell>
                  <TableCell className={classes.tableCell} component="th" scope="row" align="center">
                    {eachRow.createdAt}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 41 * emptyRows }}>
                  <TableCell colSpan={4} />
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
          pageSize: 5,
          pageSizeOptions: [5, 10],
          headerStyle: { backgroundColor: '#929ef8', color: 'white' },
          draggable: false,
          paginationType: 'stepped',
        }}
        style={{ boxShadow: 'none' }}
      />
    </>
  );
}
