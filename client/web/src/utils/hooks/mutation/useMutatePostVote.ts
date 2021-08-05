import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

type VoteProps = {postId: number, vote: 1|0}

async function votePost({ postId, vote }: VoteProps) {
  const { data } = await axios.post<number>(`/community/posts/${postId}/recommend`, {
    vote,
  });
  return data;
}

export function useMutatePostVote(): UseMutationResult<number, AxiosError, VoteProps> {
  const queryClient = useQueryClient();
  return useMutation(
    votePost,
    {
      onSuccess: (result, { postId, vote }) => {
        queryClient.invalidateQueries(['post', postId]);
      },
    },
  );
}
