import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

type ChangeNicknameParam = {userId: string, nickname: string};

async function changeNickname({ userId, nickname }: ChangeNicknameParam) {
  const { data } = await axios.patch('/users/nickname', {
    userId, nickname,
  });
  return data;
}

export function useMutateNickname(): UseMutationResult<boolean, AxiosError, ChangeNicknameParam> {
  return useMutation(changeNickname);
}
