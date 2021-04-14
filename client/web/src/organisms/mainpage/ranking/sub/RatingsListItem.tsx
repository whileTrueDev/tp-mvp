import {
  ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Grid, Link,
} from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ListItemOrderByRatings } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import Rating from '@material-ui/lab/Rating';
import classnames from 'classnames';
import { useRatingsListItemStyles } from '../style/RatingList.style';

export interface RatingsListItemProps extends ListItemOrderByRatings{
  order?: number
}

export default function RatingsListItem(props: RatingsListItemProps): JSX.Element {
  const {
    averageRating, nickname, logo, order,
    creatorId, platform,
  } = props;
  const classes = useRatingsListItemStyles();
  return (
    <ListItem className={classnames(classes.listItem, classes[`listItem-${order}`])}>
      <Grid container>
        <Grid container item xs={2} alignItems="center" justify="center">
          {order && order <= 4 && <Typography className={classes.orderText}>{`${order}위!`}</Typography>}
        </Grid>
        <Grid container item xs={5} alignItems="center" wrap="nowrap">
          <ListItemAvatar>
            <Avatar className={classes.avatarImage} alt={`${nickname} 프로필 이미지`} src={logo} />
          </ListItemAvatar>
          <ListItemText primary={(
            <Link component={RouterLink} to={`/ranking/${platform}/${creatorId}`}>
              <Typography
                className={classnames(
                  classes.creatorName, { [classes.black]: order && order < 5 },
                )}
              >
                {nickname}
              </Typography>
            </Link>
        )}
          />
        </Grid>
        <Grid container item xs={4} alignItems="center" justify="center">
          <Rating
            value={averageRating / 2}
            precision={0.1}
            readOnly
          />
          <Typography
            className={classes.ratingText}
          >
            {`평점 ${averageRating.toFixed(2)}`}
          </Typography>
        </Grid>
        <Grid container item xs={1} alignItems="center" />
      </Grid>

    </ListItem>
  );
}
