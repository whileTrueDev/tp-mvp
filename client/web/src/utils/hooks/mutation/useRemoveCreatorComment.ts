import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

type Tvariable = {
  commentId: number,
  callback?: () => void
}
async function removeCreatorComment({ commentId }: Tvariable) {
  const res = await axios.delete(`/creatorComment/${commentId}`);
  return res.data;
}

export default function useRemoveCreatorComment(): UseMutationResult<string, AxiosError, Tvariable> {
  const queryClient = useQueryClient();
  return useMutation<string, AxiosError, Tvariable>(
    removeCreatorComment,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('creatorComment');
      },
      onError: (error) => console.error(error),
      onSettled: (data, error, variables) => {
        const { callback } = variables;
        if (callback) callback();
      },
    },
  );
}
