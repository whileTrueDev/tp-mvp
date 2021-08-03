import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export default function useHitPost(): UseMutationResult<any, Error, number> {
  return useMutation(
    async (postId: number) => {
      const res = await axios.post(`/community/posts/${postId}/hit`);
      return res.data;
    },
  );
}
