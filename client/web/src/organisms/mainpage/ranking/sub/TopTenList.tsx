import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Avatar, Divider, Typography } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import yellow from '@material-ui/core/colors/yellow';
import orange from '@material-ui/core/colors/orange';
import classnames from 'classnames';
import { TopTenListProps } from '../types/ToptenCard.types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  wrapper: {
    paddingTop: theme.spacing(2),
  },
  header: {
    display: 'flex',
  },
  headerColumn: {
    color: theme.palette.grey[600],
  },
  listItems: {},
  listItem: {
    display: 'flex',
    height: theme.spacing(12),
    '&:nth-child(1) $star': {
      color: yellow[500],
    },
    '&:nth-child(2) $star': {
      color: theme.palette.grey[300],
    },
    '&:nth-child(3) $star': {
      color: orange[500],
    },
  },
  star: {
    marginBottom: (-1) * theme.spacing(1),
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderContainer: {
    flexDirection: 'column',
  },
  avatarContainer: {},
  avatarImage: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
}));

const headerColumns = [
  {
    key: 'order', label: '순위', width: '5%', textAlign: 'center',
  },
  { key: 'profileImage', label: '', width: '15%' },
  { key: 'bjName', label: 'BJ이름', width: '45%' },
  { key: 'weeklyScoreGraph', label: '주간 점수 그래프', width: '35%' },
];
function TopTenList(props: TopTenListProps): JSX.Element {
  const classes = useStyles();
  const { data } = props;
  // console.log(data);
  return (
    <div className={classes.wrapper}>

      {/* 목록 헤더 row */}
      <div className={classes.header}>
        {headerColumns.map((column) => (
          <React.Fragment key={column.key}>
            <div
              style={{ width: column.width || 'auto' }}
              className={classes.headerColumn}
            >
              <Typography>{column.label}</Typography>
            </div>
          </React.Fragment>
        ))}
      </div>
      <Divider />

      <div className={classes.listItems}>
        {data?.rankingData.map((d, index:number) => {
          return (
            <div key={d.id} className={classes.listItem}>
              <div
              className={classnames(classes.orderContainer, classes.center)}
              style={{width: headerColumns[0].width}}>
                {index < 3 ? <StarIcon className={classes.star}/> : null}
                <Typography>{index+1}</Typography>
              </div>
              <div
              className={classnames(classes.avatarContainer, classes.center)}
              style={{width: headerColumns[1].width}}
              >
                <Avatar className={classes.avatarImage}/>
              </div>
            </div>);
        })}
      </div>

      {/* {JSON.stringify(data, null, 2)} */}
    </div>
  );
}

export default TopTenList;
