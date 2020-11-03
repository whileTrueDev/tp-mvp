import React from 'react';
import {
  TablePagination, TableCell, TableRow, TableBody, Chip,
} from '@material-ui/core';
import shortid from 'shortid';
import Table from '../../../atoms/Table/MaterialTable';

interface TableProps {
  metrics: any;
  page: number;
  pageSize: number;
  handlePage: any;
  handlePageSize: any;
  handleClick: (a: any) => void;
  categoryTabSwitch: (value: number) => JSX.Element;
}

export default function MaterialTable({
  metrics,
  handleClick,
  page,
  pageSize,
  handlePage,
  handlePageSize,
  categoryTabSwitch,
}: TableProps): JSX.Element {
  const emptyRows = pageSize - Math.min(pageSize, metrics.length - page * pageSize);
  const progressTab = (value: number) => {
    switch (value) {
      case 1: return (<Chip variant="outlined" label="개발 확정" />);
      case 2: return (<Chip color="primary" label="개발보류" />);
      default: return (<Chip color="secondary" label="미확인" />);
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
            width: '200px',
            align: 'center',
            title: '카테고리',
          },
          {
            width: '200px',
            align: 'center',
            title: '작성자',
          },
          {
            width: '300px',
            align: 'center',
            title: '제목',
          },
          {
            width: '250px',
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
                  key={shortid.generate()}
                  onClick={() => handleClick(eachRow.id)}
                >
                  <TableCell style={{ padding: 10 }} component="th" scope="row" align="center">
                    {eachRow.id}
                  </TableCell>
                  <TableCell style={{ padding: 10 }} component="th" scope="row" align="center">
                    {categoryTabSwitch(eachRow.category)}
                  </TableCell>
                  <TableCell style={{ padding: 10 }} component="th" scope="row" align="center">
                    {eachRow.author}
                  </TableCell>
                  <TableCell style={{ padding: 10 }} component="th" scope="row" align="center">
                    {eachRow.title}
                  </TableCell>
                  <TableCell style={{ padding: 10 }} component="th" scope="row" align="center">
                    {eachRow.createdAt}
                  </TableCell>
                  <TableCell style={{ padding: 10 }} component="th" scope="row" align="center">
                    {progressTab(eachRow.progress)}
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
          toolbar: false,
          sorting: false,
          search: false,
          pageSize: 10,
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
