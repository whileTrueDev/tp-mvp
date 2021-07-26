import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { FirstPlacesRes } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import axios from '../../axios';

const getTopCreatorsByCategory = async () => {
  const { data } = await axios.get('/rankings/first-places-by-category');
  return data;
};

export default function useTopCreatorsByCategory(): UseQueryResult<FirstPlacesRes, AxiosError> {
  return useQuery<FirstPlacesRes, AxiosError>(
    'firstPlacesByCategory',
    getTopCreatorsByCategory,
  );
}
