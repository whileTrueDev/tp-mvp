import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

const getRecentAnalysisDate = async () => {
  const { data } = await axios.get('/rankings/recent-analysis-date');
  return data;
};

export default function useRecentAnalysisDate(): UseQueryResult<Date, AxiosError> {
  return useQuery<Date, AxiosError>(
    'recentAnalysisDate',
    getRecentAnalysisDate,
  );
}
