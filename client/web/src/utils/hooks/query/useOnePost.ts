import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { CommunityPost } from '@truepoint/shared/dist/interfaces/CommunityPost.interface';
import axios from '../../axios';

const getOnePost = async (postId: number) => {
  const { data } = await axios.get<CommunityPost>(`/community/posts/${postId}`);
  return data;
};

export default function useOnePost(
  postId: number,
  options?: UseQueryOptions<CommunityPost>,
): UseQueryResult<CommunityPost> {
  return useQuery(
    ['post', postId],
    () => getOnePost(postId),
    options,
  );
}
