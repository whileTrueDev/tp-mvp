import { useMutation, UseMutationResult } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

async function deletePost(postId: number) {
  const res = await axios.delete(`/community/posts/${postId}`);
  return res.data;
}

export default function useDeletePost(): UseMutationResult<string, AxiosError, number> {
  return useMutation<string, AxiosError, number>(
    deletePost,
  );
}
