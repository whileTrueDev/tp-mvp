import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

type CheckPasswordDto = {
  password: string
}
export function useCheckPassword(
  url: string,
): UseMutationResult<boolean, AxiosError, CheckPasswordDto> {
  async function checkPassword(checkPassowrdDto: CheckPasswordDto) {
    const { data } = await axios.post(url, checkPassowrdDto);
    return data;
  }

  return useMutation(checkPassword);
}
