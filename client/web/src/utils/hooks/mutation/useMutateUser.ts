import { CreateUserDto } from '@truepoint/shared/dto/users/createUser.dto';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { useMutation, UseMutationResult } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

async function registUser(createUserDto: CreateUserDto) {
  const { data } = await axios.post(
    '/users',
    createUserDto,
  );
  return data;
}

export function useRegistUser(): UseMutationResult<User, AxiosError, CreateUserDto> {
  return useMutation(registUser);
}
