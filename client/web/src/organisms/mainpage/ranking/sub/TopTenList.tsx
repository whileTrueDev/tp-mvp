import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Divider, Typography } from '@material-ui/core';
import { TopTenListProps } from '../types/ToptenCard.types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  listWrapper: {
    paddingTop: theme.spacing(2),
  },
  header: {
    display: 'flex',
  },
  headerColumn: {
    color: theme.palette.grey[600],
  },
}));

const headerColumns = [
  { key: 'order', label: '순위', width: '5%' },
  { key: 'profileImage', label: '', width: '15%' },
  { key: 'bjName', label: 'BJ이름', width: '45%' },
  { key: 'weeklyScoreGraph', label: '주간 점수 그래프', width: '35%' },
];
function TopTenList(props: TopTenListProps): JSX.Element {
  const classes = useStyles();
  const { data } = props;
  console.log(data);
  return (
    <div className={classes.listWrapper}>

      <div className={classes.header}>
        {headerColumns.map((column) => (
          <React.Fragment key={column.key}>
            <div style={{ width: column.width || 'auto' }} className={classes.headerColumn}>
              <Typography>{column.label}</Typography>
            </div>
          </React.Fragment>
        ))}
      </div>
      <Divider />

      {/* {JSON.stringify(data, null, 2)} */}
    </div>
  );
}

export default TopTenList;
