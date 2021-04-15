import React from 'react';
import {
  Divider, Grid, List, ListItem, Typography,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import RatingsListItem, { RatingsListItemProps } from './sub/RatingsListItem';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import { useRatingsListStyles } from './style/RatingList.style';

export default function RatingsList(): JSX.Element {
  const classes = useRatingsListStyles();
  const [{ data, loading, error }] = useAxios<RatingsListItemProps[]>({
    url: '/ratings/list',
    params: {
      skip: 0,
      take: 10,
    },
  });

  return (
    <section className={classes.ratingsListSection}>
      <Typography className={classes.title}>주간 집계 시청자 평점 순위</Typography>
      <List className={classes.listItemContainer}>
        <ListItem>
          <Grid container>
            <Grid item xs={2}><Typography align="center">순위</Typography></Grid>
            <Grid item xs={5}><Typography align="center">스트리머</Typography></Grid>
            <Grid item xs={4}><Typography align="center">평점</Typography></Grid>
            <Grid item xs={1}><Typography align="center" /></Grid>
          </Grid>
        </ListItem>
        {loading ? <CenterLoading /> : null}
        {error ? <Typography className={classes.text}>데이터를 불러오는 데 실패하였습니다</Typography> : null}

        {data && data.length
          ? data.map((d, index) => (
            <React.Fragment key={d.creatorId}>
              <RatingsListItem {...d} order={index + 1} />
              {(index === data.length - 1)
                ? null
                : <Divider variant="middle" component="li" />}
            </React.Fragment>
          ))
          : <Typography className={classes.text}>데이터가 없습니다</Typography>}
      </List>

    </section>
  );
}
