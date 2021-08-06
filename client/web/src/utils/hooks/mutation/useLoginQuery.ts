import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

type LoginParam = {
  userId: string,
  password: string,
  stayLogedIn: boolean, // 자동 로그인 여부
};

type LoginRes = {
  ['access_token']: string,
}

async function login(param: LoginParam) {
  const { data } = await axios.post('/auth/login',
    param);
  return data;
}

export function useLoginQuery(): UseMutationResult<LoginRes, AxiosError, LoginParam> {
  return useMutation(login);
}
