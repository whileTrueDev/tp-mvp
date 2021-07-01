import React from 'react';
import classnames from 'classnames';
import {
  TablePagination, TableCell, TableRow, TableBody, Typography, useTheme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import shortid from 'shortid';
import Table from '../../../atoms/Table/MaterialTable';
// 날짜표현 컴포넌트 추가
import { dayjsFormatter } from '../../../utils/dateExpression';
import useMediaSize from '../../../utils/hooks/useMediaSize';

const TABLE_ROW_HEIGHT = 45;
interface TableProps {
  isLoading: boolean;
  metrics: any;
  page: number;
  pageSize: number;
  handlePage: any;
  handlePageSize: any;
  handleClick: (a: any) => void;
}
const useStyles = makeStyles((theme) => ({
  tableCell: {
    padding: theme.spacing(1),
    fontSize: theme.typography.body1.fontSize,
  },
  tableRow: {
    height: TABLE_ROW_HEIGHT,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  importantRow: {
    backgroundColor: theme.palette.action.hover,
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  importantText: {
    fontWeight: 'bold',
  },
}));
export default function MaterialTable({
  isLoading,
  metrics,
  handleClick,
  page,
  pageSize,
  handlePage,
  handlePageSize,
}: TableProps): JSX.Element {
  const classes = useStyles();
  const emptyRows = pageSize - Math.min(pageSize, metrics.length - page * pageSize);
  const { isMobile } = useMediaSize();
  const theme = useTheme();

  return (
    <>
      <Table
        columns={[
          {
            width: '5%',
            align: 'center',
            title: ' ',
          },
          {
            width: '10%',
            align: 'center',
            title: '카테고리',
          },
          {
            width: '70%',
            align: 'center',
            title: '제목',
          },
          {
            width: '150px',
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
                    [classes.tableRow]: true, [classes.importantRow]: eachRow.isImportant,
                  })}
                >
                  { isMobile
                    ? (
                      <>
                        <TableCell>
                          <Typography variant="subtitle1">
                            {eachRow.isImportant && <NotificationImportantIcon color="primary" />}
                            {eachRow.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {dayjsFormatter(eachRow.createdAt, 'll')}
                          </Typography>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className={classes.tableCell} scope="row" align="center">
                          {eachRow.isImportant ? (
                            <div style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            >
                              <NotificationImportantIcon color="primary" />
                              <Typography className={classes.importantText}>
                                중요
                              </Typography>
                            </div>
                          ) : eachRow.id}
                        </TableCell>
                        <TableCell className={classes.tableCell} scope="row" align="center">
                          {eachRow.category}
                        </TableCell>
                        <TableCell
                          className={classnames({
                            [classes.tableCell]: true,
                            [classes.importantText]: eachRow.isImportant,
                          })}
                          scope="row"
                          align="left"
                        >
                          {eachRow.title}
                        </TableCell>
                        <TableCell className={classes.tableCell} scope="row" align="center">
                          {dayjsFormatter(eachRow.createdAt, 'll')}
                        </TableCell>
                      </>
                    )}

                </TableRow>
              ))}
              {emptyRows > 0 && !isMobile && (
                <TableRow style={{ height: TABLE_ROW_HEIGHT * emptyRows }}>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
          ),
        }}
        isLoading={isLoading}
        onChangePage={handlePage}
        onChangeRowsPerPage={handlePageSize}
        options={{
          toolbar: false,
          sorting: false,
          search: false,
          pageSize,
          pageSizeOptions: [8, 12],
          header: !isMobile,
          headerStyle: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontSize: theme.typography.subtitle1.fontSize,
          },
          draggable: false,
          paginationType: 'stepped',
        }}
        style={{ boxShadow: 'none' }}
      />
    </>
  );
}
