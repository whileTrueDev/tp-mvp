import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

type Props = {
  replyId: number,
  postId: number
}

async function removeCreatorComment({ replyId }: Props) {
  const res = await axios.delete(`community/replies/${replyId}`);
  return res.data;
}

export default function useRemovePostComment(): UseMutationResult<string, AxiosError, Props> {
  const queryClient = useQueryClient();
  return useMutation<string, AxiosError, Props>(
    removeCreatorComment,
    {
      onSuccess: (data, props) => {
        const { postId } = props;
        queryClient.invalidateQueries(['postComments', postId]);
      },
    },
  );
}
