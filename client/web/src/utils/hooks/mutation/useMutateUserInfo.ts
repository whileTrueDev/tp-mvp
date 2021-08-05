import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

// 닉네임 변경
type ChangeNicknameParam = {userId: string, nickName: string};

async function changeNickname({ userId, nickName }: ChangeNicknameParam) {
  const { data } = await axios.patch('/users/nickname', {
    userId, nickName,
  });
  return data;
}

export function useMutateNickname(): UseMutationResult<boolean, AxiosError, ChangeNicknameParam> {
  return useMutation(changeNickname);
}

// 비밀번호 변경
type ChangePasswordParam = {userDI: string, password: string};

async function changePassword({ userDI, password }: ChangePasswordParam) {
  const { data } = await axios.patch('/users/password', {
    userDI, password,
  });
  return data;
}

export function useMutatePassword(): UseMutationResult<boolean, AxiosError, ChangePasswordParam> {
  return useMutation(changePassword);
}
