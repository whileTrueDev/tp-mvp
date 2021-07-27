import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { UserReaction as IUserReaction } from '@truepoint/shared/dist/interfaces/UserReaction.interface';
import axios from '../../axios';

type TDeleteVar = {
  id: number;
  callback: () => void;
}

async function removeUserReaction({ id }: TDeleteVar): Promise<boolean> {
  const { data: deleteSuccess } = await axios.delete(`/user-reactions/${id}`);
  return deleteSuccess;
}

export default function useRemoveUserReaction(): UseMutationResult<boolean, AxiosError, TDeleteVar> {
  const queryClient = useQueryClient();
  return useMutation(removeUserReaction, {
    onSuccess: (deleteSuccess, variables) => {
      if (deleteSuccess) {
        variables.callback();
        queryClient.setQueryData<IUserReaction[] | undefined>(
          'userReactions',
          (oldData) => oldData?.filter((data) => data.id !== variables.id),
        );
      }
    },
  });
}
