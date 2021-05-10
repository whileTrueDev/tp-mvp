import {
  ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Grid, Link,
} from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { WeeklyRatingRankingItem } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import Rating from '@material-ui/lab/Rating';
import classnames from 'classnames';
import { Textfit } from 'react-textfit';
import { useRatingsListItemStyles } from '../style/RatingList.style';

export interface RatingsListItemProps extends WeeklyRatingRankingItem{
  order?: number
}

export default function RatingsListItem(props: RatingsListItemProps): JSX.Element {
  const {
    averageRating, nickname, logo, order,
    creatorId, platform, rankChange,
  } = props;
  const classes = useRatingsListItemStyles();
  return (
    <ListItem className={classnames(classes.listItem, classes[`listItem-${order}`])}>
      <div className={classes.contentBackground} />
      <div className={classes.frame} />
      <Grid container className={classes.contentBox}>
        <Grid container item xs={2} direction="column" alignItems="center" justify="center">
          <Typography className={classes.orderText}>{order}</Typography>
          <img
            className={classnames(classes.platformLogo, { twitch: platform === 'twitch' }, { afreeca: platform === 'afreeca' })}
            src={`/images/logo/${platform === 'twitch' ? 'twitchLogo_no_bg' : 'afreecaLogo'}.png`}
            alt={`${platform}로고`}
          />
        </Grid>
        <Grid container item xs={4} alignItems="center" wrap="nowrap">
          <ListItemAvatar>
            <Avatar className={classes.avatarImage} alt={`${nickname} 프로필 이미지`} src={logo} />
          </ListItemAvatar>
          <ListItemText primary={(
            <Link component={RouterLink} to={`/ranking/${platform}/${creatorId}`}>
              <Typography
                component="div"
                className={classnames(
                  classes.creatorName, { [classes.black]: order && order < 5 },
                )}
              >
                <Textfit mode="single" max={20}>{nickname}</Textfit>
              </Typography>
            </Link>
        )}
          />
        </Grid>
        <Grid container item xs={4} alignItems="center" justify="center">
          <Rating
            className={classes.rating}
            value={averageRating / 2}
            precision={0.1}
            size="large"
            readOnly
          />
          <Typography
            className={classes.ratingText}
          >
            {`평점 ${averageRating.toFixed(2)}`}
          </Typography>
        </Grid>
        <Grid container item xs={2} alignItems="center" justify="center">
          <Typography className={classnames(
            classes.rankChange,
            { up: rankChange > 0 },
            { down: rankChange < 0 },
            { remain: rankChange === 0 },
          )}
          >
            {rankChange === 9999 ? 'new' : rankChange}
          </Typography>
        </Grid>
      </Grid>

    </ListItem>
  );
}
