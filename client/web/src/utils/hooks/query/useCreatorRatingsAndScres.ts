import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import {
  CreatorRatingInfoRes,
} from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import axios from '../../axios';

const getCreatorRatingsAndScores = async (creatorId: string) => {
  const { data } = await axios.get(`/ratings/info/${creatorId}`);
  return data;
};

export default function useCreatorRatingsAndScores(
  creatorId: string,
): UseQueryResult<CreatorRatingInfoRes, AxiosError> {
  return useQuery<CreatorRatingInfoRes, AxiosError>(
    'creatorRatingsAndScores',
    () => getCreatorRatingsAndScores(creatorId),
    {
      enabled: !!creatorId,
      placeholderData: {
        ratings: { average: 0, count: 0 },
        scores: {
          smile: 0,
          frustrate: 0,
          admire: 0,
          cuss: 0,
          cussRank: 0,
          smileRank: 0,
          admireRank: 0,
          frustrateRank: 0,
          total: 0,
        },
      },
    },
  );
}
