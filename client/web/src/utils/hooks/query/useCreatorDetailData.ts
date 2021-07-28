import { useQuery, UseQueryResult } from 'react-query';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { AxiosError } from 'axios';
import axios from '../../axios';

const getCreatorDetailData = async (creatorId: string) => {
  const { data } = await axios.get('/users', { params: { creatorId } });
  return data;
};

export default function useCreatorDetailData(creatorId: string): UseQueryResult<User, AxiosError> {
  return useQuery<User, AxiosError>(
    ['creatorDetail', creatorId],
    () => getCreatorDetailData(creatorId),
  );
}
