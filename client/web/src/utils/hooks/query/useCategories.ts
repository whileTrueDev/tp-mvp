import { useQuery, UseQueryResult } from 'react-query';
import { CategoryGetRequest } from '@truepoint/shared/dist/dto/category/categoryGet.dto';
import { AxiosError } from 'axios';
import axios from '../../axios';

async function getCategories() {
  const { data } = await axios.get('/category');
  return data;
}

export default function useCategories(): UseQueryResult<CategoryGetRequest[], AxiosError> {
  return useQuery(
    'categories',
    getCategories,
  );
}
