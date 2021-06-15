import {
  Avatar, Card, Typography,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import useAxios from 'axios-hooks';
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { FirstPlacesRes, TopTenDataItem, Scores } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import { Link } from 'react-router-dom';
import { afreecaItemBackgroundColor, CAROUSEL_HEIGHT, twitchItemBackgroundColor } from '../../../../assets/constants';

export const useCreatorCardStyle = makeStyles((theme: Theme) => createStyles({
  link: {
    '&:not(:last-child)': {
      marginRight: theme.spacing(4),
    },
    textDecoration: 'none',
  },
  card: {
    width: theme.spacing(20),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&>*': {
      marginBottom: theme.spacing(1),
    },
  },
  headerText: {
    width: '100%',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightBold,
    padding: theme.spacing(1),
    color: theme.palette.primary.contrastText,
    '&.afreeca': {
      backgroundColor: afreecaItemBackgroundColor,
    },
    '&.twitch': {
      backgroundColor: twitchItemBackgroundColor,
    },
  },
  avatar: {
    width: theme.spacing(11),
    height: theme.spacing(11),
  },
}));

export interface FirstPlaceCreatorCardProps extends TopTenDataItem{
  headerText: string,
  category: keyof Scores,
}
export function FirstPlaceCreatorCard(props: FirstPlaceCreatorCardProps): JSX.Element {
  const {
    headerText, creatorId, creatorName, platform, averageRating, category,
    afreecaProfileImage, twitchProfileImage,
  } = props;
  const classes = useCreatorCardStyle();

  // eslint-disable-next-line react/destructuring-assignment
  const value = category === 'rating' ? props.averageRating : props[category];
  const suffix = category === 'viewer' ? '명' : '점';
  const logo = afreecaProfileImage || twitchProfileImage || undefined;
  return (
    <Link to={`/rankings/creator/${creatorId}`} className={classes.link}>
      <Card className={classes.card} elevation={4}>
        <Typography className={classnames(classes.headerText, platform)}>
          {headerText}
        </Typography>
        <Avatar src={logo} alt={creatorName} className={classes.avatar} />
        <Typography color="primary">{creatorName}</Typography>
        <Rating readOnly precision={0.1} value={averageRating ? averageRating / 2 : 0} />
        <Typography>{`${value} ${suffix}`}</Typography>
      </Card>
    </Link>
  );
}

export default function FirstPlaceCreators(): JSX.Element {
  const [{ loading, data, error }] = useAxios<FirstPlacesRes>({
    url: 'rankings/first-places-by-category',
    method: 'get',
  });
  if (error) {
    return <div>error</div>;
  }
  const firstPlaces: {category: keyof FirstPlacesRes, headerText: string}[] = [
    { category: 'viewer', headerText: '최고 시청자수 1위' },
    { category: 'rating', headerText: '시청자 평점 1위' },
    { category: 'smileScore', headerText: '웃음 점수 1위' },
    { category: 'cussScore', headerText: '욕 점수 1위' },
  ];
  return (
    <div style={{
      height: CAROUSEL_HEIGHT,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      {!loading && data
      && (
        firstPlaces.map((item) => (
          <FirstPlaceCreatorCard
            headerText={item.headerText}
            key={item.category}
            category={item.category}
            {...data[item.category]}
          />
        ))
      )}
    </div>
  );
}
