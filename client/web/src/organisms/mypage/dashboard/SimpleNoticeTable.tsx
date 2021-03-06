import React from 'react';
import classnames from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { Notice as NoticeData } from '@truepoint/shared/dist/interfaces/Notice.interface';
// 날짜표현추가
import useAxios from 'axios-hooks';
import { dayjsFormatter } from '../../../utils/dateExpression';

const useStyles = makeStyles((theme) => ({
  container: { padding: theme.spacing(6) },
  table: { minWidth: 650 },
  title: { fontWeight: 'bold' },
  linkText: { cursor: 'pointer' },
  important: { fontWeight: 'bold' },
}));

export default function SimpleNoticeTable(): JSX.Element {
  const history = useHistory();
  const classes = useStyles();
  // Notice data
  const [{ loading, data }] = useAxios<NoticeData[]>({
    url: '/notice/outline',
    method: 'GET',
    params: { important: 2 },
  });

  return (
    <Paper className={classes.container}>
      <div style={{ marginBottom: 32 }}>
        <Typography variant="h6" className={classes.title}>공지사항</Typography>
      </div>

      <TableContainer>
        <Table className={classes.table} aria-label="notice table" size="medium">
          <TableBody>
            {!loading && data && data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell width={150} scope="row" component="th" align="left">
                  <Typography>{row.category}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography
                    component="a"
                    className={classnames({
                      [classes.linkText]: true, [classes.important]: row.isImportant,
                    })}
                    onClick={() => {
                      history.push(`/notice/${row.id}`);
                    }}
                  >
                    {`${row.isImportant ? '[중요공지]' : ''} ${row.title}`}
                  </Typography>
                </TableCell>
                <TableCell width={250} align="right">
                  <Typography>
                    {dayjsFormatter(row.createdAt, 'll')}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {!loading && data && data.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={3}>아직 공지사항이 없습니다.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
