import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

const getCreatorCategoryTabs = async () => {
  const { data } = await axios.get('/creator-category');
  return data;
};

export type CategoryInDB = {categoryId: number, name: string}

export default function useCreatorCategoryTabs(): UseQueryResult<CategoryInDB[], AxiosError> {
  return useQuery<CategoryInDB[], AxiosError>(
    'creatorCategoryTabs',
    getCreatorCategoryTabs,
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
}
