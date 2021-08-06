import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export default function useHitPost(): UseMutationResult<number, Error, number> {
  return useMutation(
    async (postId: number) => {
      const res = await axios.post(`/community/posts/${postId}/hit`);
      return res.data;
    },
  );
}
