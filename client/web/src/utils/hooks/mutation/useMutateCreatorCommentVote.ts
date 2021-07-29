import { useMutation, UseMutationResult } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';
import useAuthContext from '../useAuthContext';

type Variables = {
  url: string,
  vote: 0 | 1, // 1: 좋아요, 0: 싫어요
}
type Result = {
  hate: number,
  like: number
}

export default function useMutateCreatorCommentVote(): UseMutationResult<Result, AxiosError, Variables> {
  const auth = useAuthContext();

  return useMutation<Result, AxiosError, Variables>(
    async (props: Variables) => {
      const { url, vote } = props;
      const res = await axios.post(url, { vote, userId: auth.user.userId || null });
      return res.data;
    },
  );
}
