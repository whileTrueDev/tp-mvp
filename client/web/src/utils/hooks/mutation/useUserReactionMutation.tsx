import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { UserReaction as IUserReaction } from '@truepoint/shared/dist/interfaces/UserReaction.interface';
import { CreateUserReactionDto } from '@truepoint/shared/dist/dto/userReaction/createUserReaction.dto';
import { AxiosError } from 'axios';
import axios from '../../axios';

export default function useUserReactionMutation(): UseMutationResult<IUserReaction, AxiosError, CreateUserReactionDto> {
  const queryClient = useQueryClient();
  return useMutation<IUserReaction, AxiosError, CreateUserReactionDto>(
    async (newChat) => {
      const res = await axios.post('/user-reactions', newChat);
      return res.data;
    },
    {
      onSuccess: (newChat) => {
        queryClient.setQueryData<IUserReaction[] | undefined>('userReactions', (oldData) => {
          if (!oldData) {
            return [newChat];
          }
          // 잡담방 데이터는 최대 20개만 표시
          if (oldData.length < 20) {
            return [...oldData, newChat];
          }
          // 20개 이상인 경우 가장 오래된 데이터 제외하고 새 데이터 추가
          return [...oldData.slice(1), newChat];
        });
      },
    },
  );
}
