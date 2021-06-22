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

  let value: number | string;
  if (category === 'rating') {
    value = props.averageRating || 0;
  } else if (category === 'viewer') {
    value = props[category] || 0;
  } else {
    // 감정점수 (10점 이상의 값을 가진 경우 10점 만점으로 보여준다)
    const score = Math.min(10, props[category] || 0);
    value = score.toFixed(2);
  }

  const suffix = category === 'viewer' ? '명' : '점';
  const logo = afreecaProfileImage || twitchProfileImage || undefined;
  return (
    <Link to={`/ranking/creator/${creatorId}`} className={classes.link}>
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
      {error && (<Typography>데이터를 가져오지 못했습니다</Typography>)}
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
