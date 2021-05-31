import React from 'react';
import {
  Grid, List, ListItem, Typography,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import { WeeklyRatingRankingRes } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import RatingsListItem from './sub/RatingsListItem';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import { useRatingsListStyles } from './style/RatingList.style';

export default function RatingsList(): JSX.Element {
  const classes = useRatingsListStyles();
  const [{ data, loading, error }] = useAxios<WeeklyRatingRankingRes>({
    url: '/ratings/weekly-ranking',
  });

  return (
    <section className={classes.ratingsListSection}>
      <Typography className={classes.title}>주간 평점 순위</Typography>
      <Typography className={classes.subTitle}>
        {data && `(${data.startDate} ~ ${data.endDate}) 기준`}
      </Typography>
      <List className={classes.listItemContainer}>
        <ListItem>
          <Grid container>
            <Grid item xs={2}><Typography className={classes.headerText}>순위</Typography></Grid>
            <Grid item xs={4}><Typography className={classes.headerText}>활동명</Typography></Grid>
            <Grid item xs={4}><Typography className={classes.headerText}>평점</Typography></Grid>
            <Grid item xs={2}><Typography className={classes.headerText}>변동</Typography></Grid>
          </Grid>
        </ListItem>
        {loading ? <CenterLoading /> : null}
        {error ? <Typography className={classes.text}>데이터를 불러오는 데 실패하였습니다</Typography> : null}

        {data && data.rankingList.length
          ? data.rankingList.map((d, index) => (
            <React.Fragment key={d.creatorId}>
              <RatingsListItem {...d} order={index + 1} />
            </React.Fragment>
          ))
          : <Typography className={classes.text}>데이터가 없습니다</Typography>}
      </List>

    </section>
  );
}
