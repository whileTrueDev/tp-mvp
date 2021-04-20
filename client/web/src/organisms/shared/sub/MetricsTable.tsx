import React from 'react';
import {
  TablePagination, TableCell, TableRow, TableBody,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import shortid from 'shortid';
import classNames from 'classnames';
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
    background: `linear-gradient(to right, ${theme.palette.error.light}, ${theme.palette.error.main})`,
  },
}));

// @hwasurr - 10.13 eslint 버그 수정중 disalbe함. 이후 rowData 타입 올바르게 작성해주십시오.
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function highlightTerm(rowData: any): string {
  function getFormatDate(date: Date, index: number, isStart: boolean): string {
    let duringDay;
    if (isStart) {
      duringDay = parseInt(`${(index - 1) / 2880}`, 10);
    } else {
      duringDay = parseInt(`${(index + 1) / 2880}`, 10);
    }
    const getHours = date.getHours() + (duringDay * 24);
    const getMinutes = date.getMinutes();
    const getSeconds = date.getSeconds();
    const hours = getHours >= 10 ? String(getHours) : `0${getHours}`;
    const minutes = getMinutes >= 10 ? String(getMinutes) : `0${getMinutes}`;
    const seconds = getSeconds >= 10 ? String(getSeconds) : `0${getSeconds}`;

    return `${hours}시${minutes}분${seconds}초`;
  }

  const {
    start_date, end_date, start_index, end_index,
  } = rowData;
  const startTime = new Date(start_date);
  const endTime = new Date(end_date);
  const addEndTime = new Date(endTime.setSeconds(endTime.getSeconds() + 30));
  const resultStartTime = getFormatDate(startTime, start_index, true);
  const resultEndTime = getFormatDate(addEndTime, end_index, false);

  return `${resultStartTime} ~ ${resultEndTime}`;
}

// @hwasurr - 10.13 eslint 버그 수정중 disalbe함. 이후 row ,arr 타입 올바르게 작성해주십시오.
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

interface TableProps {
  metrics: any;
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

  // 테이블에 데이터가 주입전 렌더링 되어 오류 뜨는 현상 해결위해
  function getCheck(a: any, b: any): boolean {
    if (Object.prototype.hasOwnProperty.call(a, 'tableData')) {
      if (a.tableData.id === b.index) return true;
    }
    return false;
  }

  return (
    <>
      <Table
        columns={[
          {
            align: 'center',
            title: '시간',
          },
          {
            align: 'center',
            title: type === '트루포인트 편집점' ? '트루포인트 점수' : '횟수',
          },
        ]}
        data={metrics || []}
        isLoading={!metrics}
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
                  className={classNames({ [classes.row]: true, [classes.selectedRow]: getCheck(eachRow, row) })}
                  onClick={() => {
                    if (handleClick) {
                      handleClick({
                        startTime: highlightTerm(eachRow).slice(0, 8),
                        endTime: highlightTerm(eachRow).slice(9),
                        start_index: eachRow.start_index,
                        end_index: eachRow.end_index,
                        score: eachRow.score,
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
                      ? Math.round(eachRow.score)
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
          headerStyle: { backgroundColor: '#929ef8', color: 'white', padding: 10 },
          draggable: false,
          paginationType: 'stepped',
          showTitle: false,
          toolbar: false,
        }}
        style={{ boxShadow: 'none' }}
      />
    </>
  );
}
