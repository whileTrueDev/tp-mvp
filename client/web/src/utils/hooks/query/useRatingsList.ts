import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { WeeklyRatingRankingRes } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import axios from '../../axios';

const getRatingsWeeklyRankingList = async () => {
  const { data } = await axios.get('/ratings/weekly-ranking');
  return data;
};

export default function useRatingsWeeklyRankingList(): UseQueryResult<WeeklyRatingRankingRes, AxiosError> {
  return useQuery<WeeklyRatingRankingRes, AxiosError>(
    'ratingsWeeklyRanking',
    getRatingsWeeklyRankingList,
  );
}
