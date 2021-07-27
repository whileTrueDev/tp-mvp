import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

const getCreatorCategoryTabs = async () => {
  const { data } = await axios.get('/creator-category');
  return data;
};

type Category = {categoryId: number, name: string}

export default function useCreatorCategoryTabs(): UseQueryResult<Category[], AxiosError> {
  return useQuery<Category[], AxiosError>(
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
