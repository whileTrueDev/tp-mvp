import React from 'react';
import {
  TablePagination, TableCell, TableRow, TableBody,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import shortid from 'shortid';
import Table from '../../../atoms/Table/MaterialTable';

const styles = makeStyles((theme) => ({
  row: {
    height: 30,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  selectedRow: {
    height: 30,
    background: `linear-gradient(to right, ${theme.palette.success.light}, ${theme.palette.success.main})`,
  },
}));

interface TableProps {
  metrics: any;
  title: string;
  row: any;
  page: number;
  pageSize: number;
  handlePage: any;
  handlePageSize: any;
  type: string;
  handleClick: (a: any) => void;
}

export default function MaterialTable({
  metrics,
  title,
  handleClick,
  row,
  page,
  pageSize,
  handlePage,
  handlePageSize,
  type,
}: TableProps): JSX.Element {
  const classes = styles();
  const emptyRows = pageSize - Math.min(pageSize, metrics.length - page * pageSize);

  return (
    <>
      <Table
        title={title}
        columns={[
          {
            width: '200px',
            align: 'center',
            title: '시간',
          },
          {
            width: '180px',
            align: 'center',
            title: type === '트루포인트 편집점' ? '트루포인트 점수' : '횟수',
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
                  className={
                    eachRow.tableData.id === row.index
                      ? classes.selectedRow
                      : classes.row
                  }
                >
                  <TableCell style={{ padding: 10 }} component="th" scope="row" align="center">
                    {/* {highlightTerm(eachRow)} */}
                  </TableCell>
                  <TableCell style={{ padding: 10 }} align="center">
                    { type === '트루포인트 편집점'
                      ? Math.round(eachRow.score * 100)
                      : eachRow.score}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 41 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          ),
        }}
        onChangePage={handlePage}
        onChangeRowsPerPage={handlePageSize}
        options={{
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
