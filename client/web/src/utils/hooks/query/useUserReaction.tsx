import { useQuery, UseQueryResult } from 'react-query';
import { UserReaction as IUserReaction } from '@truepoint/shared/dist/interfaces/UserReaction.interface';
import { AxiosError } from 'axios';
import axios from '../../axios';

const getUserReactions = async () => {
  const { data } = await axios.get('/user-reactions');
  return data;
};

export default function useUserReactions(): UseQueryResult<IUserReaction[], AxiosError> {
  return useQuery<IUserReaction[], AxiosError>(
    'userReactions',
    getUserReactions,
  );
}
