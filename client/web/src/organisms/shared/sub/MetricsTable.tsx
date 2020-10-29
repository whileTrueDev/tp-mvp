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

// @hwasurr - 10.13 eslint 버그 수정중 disalbe함. 이후 rowData 타입 올바르게 작성해주십시오.
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function highlightTerm(rowData: any): string {
  function getFormatDate(date: Date): string {
    const getHours = date.getHours();
    const getMinutes = date.getMinutes();
    const getSeconds = date.getSeconds();
    const hours = getHours >= 10 ? String(getHours) : `0${getHours}`;
    const minutes = getMinutes >= 10 ? String(getMinutes) : `0${getMinutes}`;
    const seconds = getSeconds >= 10 ? String(getSeconds) : `0${getSeconds}`;
    return `${hours}:${minutes}:${seconds}`;
  }

  const { start_time, end_time } = rowData;
  const startTime = new Date(start_time);
  const endTime = new Date(end_time);
  const addEndTime = new Date(endTime.setSeconds(endTime.getSeconds() + 30));
  const resultStartTime = getFormatDate(startTime);
  const resultEndTime = getFormatDate(addEndTime);

  return `${resultStartTime}~${resultEndTime}`;
}

// @hwasurr - 10.13 eslint 버그 수정중 disalbe함. 이후 row ,arr 타입 올바르게 작성해주십시오.
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rank(row: any, arr: any): number | null {
  const sorted = arr.sort((a: any, b: any) => (b.score - a.score));
  const ranking = sorted.indexOf(row);
  if (ranking > -1) return ranking + 1;
  return null;
}

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
                  onClick={() => {
                    if (handleClick) {
                      handleClick({
                        startTime: highlightTerm(eachRow).slice(0, 8),
                        endTime: highlightTerm(eachRow).slice(9),
                        start_index: eachRow.start_index,
                        end_index: eachRow.end_index,
                        score: eachRow.score,
                        rank: rank(eachRow, [...metrics]),
                        index: eachRow.tableData.id,
                      });
                    }
                  }}
                >
                  <TableCell style={{ padding: 10 }} component="th" scope="row" align="center">
                    {highlightTerm(eachRow)}
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