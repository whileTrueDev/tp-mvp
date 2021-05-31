import { useCallback, useState } from 'react';
import useAxios from 'axios-hooks';
import {
  CreatorRatingInfoRes, CreatorAverageRatings, CreatorRatingCardInfo, CreatorAverageScores,
} from '@truepoint/shared/dist/res/CreatorRatingResType.interface';

interface Props{
  platform: 'afreeca'|'twitch',
  creatorId: string
}
export default function useRatingData(props: Props): {
  info: CreatorRatingCardInfo;
  ratings: CreatorAverageRatings;
  scores: CreatorAverageScores;
  updateAverageRating: () => void;
  fetchCreatorRatingInfo: () => void;
} {
  const { platform, creatorId } = props;

  const [, getCreatorRatingInfo] = useAxios<CreatorRatingInfoRes>(`/ratings/info/${platform}/${creatorId}`, { manual: true });
  const [, refetchAverageRating] = useAxios<CreatorAverageRatings>(`/ratings/${creatorId}/average`, { manual: true });
  const [info, setInfo] = useState<CreatorRatingCardInfo>({
    platform,
    creatorId,
    logo: '',
    nickname: '',
  });
  // 해당 크리에이터에 대한 평균평점과 평가횟수
  const [ratings, setRatings] = useState<CreatorAverageRatings>({
    average: 0,
    count: 0,
  });
  const [scores, setScores] = useState<CreatorAverageScores>({
    admire: 0,
    smile: 0,
    frustrate: 0,
    cuss: 0,
  });
  // 유저가 평점을 매긴 후 평균평점을 다시 불러온다
  const updateAverageRating = useCallback(() => {
    refetchAverageRating()
      .then((res) => {
        setRatings(res.data);
      })
      .catch((error) => console.error(error));
  }, [refetchAverageRating]);

  // 크리에이터 초기 정보를 가져온다
  const fetchCreatorRatingInfo = useCallback(() => {
    getCreatorRatingInfo()
      .then((res) => {
        setInfo((prevInfo) => ({ ...prevInfo, ...res.data.info }));
        setRatings(res.data.ratings);
        setScores(res.data.scores);
      })
      .catch((error) => console.error(error));
  }, [getCreatorRatingInfo]);

  return {
    info, ratings, scores, updateAverageRating, fetchCreatorRatingInfo,
  };
}
