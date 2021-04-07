import {
  ListItem, ListItemAvatar, Avatar, ListItemText, Typography,
} from '@material-ui/core';
import React from 'react';
import { ListItemOrderByRatings } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import Rating from '@material-ui/lab/Rating';
import { useRatingsListItemStyles } from '../style/RatingList.style';

export type RatingsListItemProps = ListItemOrderByRatings

export default function RatingsListItem(props: RatingsListItemProps): JSX.Element {
  const {
    averageRating, nickname, logo,
  } = props;
  const classes = useRatingsListItemStyles();
  return (
    <ListItem className={classes.listItem}>
      <ListItemAvatar>
        <Avatar className={classes.avatarImage} alt={`${nickname} 프로필 이미지`} src={logo} />
      </ListItemAvatar>
      <ListItemText
        primary={(
          <>
            <Typography
              component="span"
              className={classes.creatorName}
            >
              {nickname}
            </Typography>
            <Typography
              component="span"
              className={classes.ratingText}
            >
              {`| 평점 ${averageRating.toFixed(2)}`}
            </Typography>
          </>
        )}
        secondary={(
          <Rating
            size="large"
            value={averageRating / 2}
            precision={0.1}
            readOnly
          />
    )}
      />
    </ListItem>
  );
}
