import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

type LogoutRes = {
  success: boolean
}
type LogoutDto = {
  userId: string
}

async function logout(logoutDto: LogoutDto) {
  const { data } = await axios.post('/auth/logout', logoutDto);
  return data;
}

export function useLogoutQuery(): UseMutationResult<LogoutRes, AxiosError, LogoutDto> {
  return useMutation(logout);
}
