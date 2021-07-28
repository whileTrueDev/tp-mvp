import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

type Tvariable = {
  creatorId: string,
  userId: string,
  callback?: () => void
}
async function removeRating(props: Tvariable) {
  const { creatorId, userId } = props;
  const res = await axios.delete(`/ratings/${creatorId}`, { data: { userId } });
  return res.data;
}

export default function useRemoveRating(): UseMutationResult<string, AxiosError, Tvariable> {
  const queryClient = useQueryClient();
  return useMutation<string, AxiosError, Tvariable>(
    removeRating,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('creatorAverageRatings');
      },
      onError: (error) => console.error(error),
      onSettled: (data, error, variables) => {
        const { callback } = variables;
        if (callback) callback();
      },
    },
  );
}
