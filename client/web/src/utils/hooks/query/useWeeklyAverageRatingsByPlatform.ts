import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

interface WeeklyAverageData {
  dates: string[],
  afreeca: number[],
  twitch: number[]
}

const getWeeklyAverageRatingByPlatform = async () => {
  const { data } = await axios.get('/ratings/weekly-average');
  return data;
};

export default function useWeeklyAverageRatingByPlatform(): UseQueryResult<WeeklyAverageData, AxiosError> {
  return useQuery<WeeklyAverageData, AxiosError>(
    'weeklyAverageRatingByPlatform',
    getWeeklyAverageRatingByPlatform,
  );
}
