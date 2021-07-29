import { useQuery, UseQueryResult } from 'react-query';
import { ScoreHistoryData } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import { AxiosError } from 'axios';
import axios from '../../axios';

const getCreatorScoresHistory = async (creatorId: string) => {
  const res = await axios.get('/rankings/scores/history', { params: { creatorId } });
  return res.data;
};

export default function useCreatorScoresHistory(creatorId: string): UseQueryResult<ScoreHistoryData[], AxiosError> {
  return useQuery<ScoreHistoryData[], AxiosError>(
    ['creatorScoresHistory', creatorId],
    () => getCreatorScoresHistory(creatorId),
  );
}
