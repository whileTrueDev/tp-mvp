import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { AxiosError } from 'axios';
import axios from '../../axios';

async function getUserProfile(userId: string) {
  const { data } = await axios.get('/users', {
    params: {
      userId,
    },
  });
  return data;
}

export function useUserProfileQuery(
  userId: string,
  options?: UseQueryOptions<User, AxiosError>,
): UseQueryResult<User, AxiosError> {
  return useQuery(
    ['user', userId],
    () => getUserProfile(userId),
    options,
  );
}
