import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { CreatorAverageScoresWithRank } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import axios from '../../axios';

const getCreatorAverageScores = async (creatorId: string) => {
  const { data } = await axios.get(`/rankings/${creatorId}/averageScores`);
  return data;
};

export default function useCreatorAverageScores(
  creatorId: string,
): UseQueryResult<CreatorAverageScoresWithRank, AxiosError> {
  return useQuery<CreatorAverageScoresWithRank, AxiosError>(
    ['creatorAverageScores', creatorId],
    () => getCreatorAverageScores(creatorId),
    {
      enabled: !!creatorId,
      placeholderData: {
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
  );
}
