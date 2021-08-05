import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { AxiosError } from 'axios';
import axios from '../../axios';

interface CertificationType {
  name?: string;
  mail?: string;
  impUid?: string;
}

export type QueryParam = {
  column: keyof CertificationType,
  value: string
} | null

async function findId(param: QueryParam) {
  // param 이 null 인경우 
  // 기본값으로 {mail: ''}을 적용
  const column: keyof CertificationType = param ? param.column : 'mail';
  const value: string = param ? param.value : '';

  const { data } = await axios.get('/users/id', {
    params: { [column]: value },
  });
  return data;
}

export function useFindIdQuery(
  param: QueryParam,
  options?: UseQueryOptions<Pick<User, 'userId' | 'provider'>, AxiosError>,
): UseQueryResult<Pick<User, 'userId' | 'provider'>, AxiosError> {
  return useQuery(
    ['findId', param],
    () => findId(param),
    options,
  );
}
