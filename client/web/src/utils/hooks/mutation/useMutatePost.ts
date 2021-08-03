import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
import { AxiosError } from 'axios';
import {
  useMutation, UseMutationResult,
} from 'react-query';
import axios from '../../axios';

// 글 생성 요청
const createPost = async (createPostDto: CreateCommunityPostDto) => {
  const { data } = await axios.post('/community/posts', createPostDto);
  return data;
};

// const platformLabelList: BoardPlatform[] = ['afreeca', 'twitch', 'free'];

export const useCreatePost = (): UseMutationResult<
any, AxiosError, CreateCommunityPostDto
> => useMutation<any, AxiosError, CreateCommunityPostDto>(
  createPost,
);
type UpdateProps = {
  postId: number,
  updatePostDto: UpdateCommunityPostDto
}
// 글 수정 요청
const updatePost = async (props: UpdateProps) => {
  const { postId, updatePostDto } = props;
  const { data } = await axios.put(`/community/posts/${postId}`, updatePostDto);
  return data;
};
export const useUpdatePost = (): UseMutationResult<
any, AxiosError, UpdateProps
> => useMutation<any, AxiosError, UpdateProps>(
  updatePost,
);
