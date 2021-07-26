import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { DailyTotalViewersResType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import axios from '../../axios';

const getViewerCompareData = async () => {
  const { data } = await axios.get('/rankings/daily-total-viewers');
  return data;
};

export default function useViewerCompareData(): UseQueryResult<DailyTotalViewersResType, AxiosError> {
  return useQuery<DailyTotalViewersResType, AxiosError>(
    'dailyTotalViewers',
    getViewerCompareData,
  );
}
