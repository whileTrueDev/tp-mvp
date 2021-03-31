import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CreatorInfoCard, { CreatorInfoCardProps } from './sub/CreatorInfoCard';
import axios from '../../../utils/axios';

const useCreatorEvalutationCardStyle = makeStyles((theme: Theme) => createStyles({
  creatorEvaluationCardContainer: {
    border: `${theme.spacing(1)}px solid ${theme.palette.text.primary}`,
  },
}));
// export interface CreatorEvaluationProps {

// }

export default function CreatorEvaluation(
// {}: CreatorEvaluationProps
): JSX.Element {
  const classes = useCreatorEvalutationCardStyle();
  const { creatorId, platform } = useParams<{creatorId: string, platform: 'afreeca'|'twitch'}>();
  const [data, setData] = useState<CreatorInfoCardProps>({
    platform,
    creatorId,
    twitchChannelName: null,
    nickname: '',
    afreecaProfileImage: null,
    twitchProfileImage: null,
    averageRating: 0,
    ratingCount: 0,
    userRating: null,
    scores: {
      admire: 0,
      smile: 0,
      frustrate: 0,
      cuss: 0,
    },
  });

  useEffect(() => {
    axios.get(`/ratings/info/${platform}/${creatorId}`)
      .then((res) => setData(((prevData) => ({ ...prevData, ...res.data }))))
      .catch((error) => console.error(error));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // 컴포넌트 마운트 이후 한번만 실행
  }, []);

  return (
    <div className={classes.creatorEvaluationCardContainer}>
      {creatorId}
      {platform}
      의 페이지
      <CreatorInfoCard {...data} />
    </div>
  );
}
