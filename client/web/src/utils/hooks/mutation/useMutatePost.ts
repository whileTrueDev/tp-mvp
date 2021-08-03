import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import {
  useMutation, UseMutationResult, useQueryClient,
} from 'react-query';
import { useHistory } from 'react-router-dom';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import axios from '../../axios';

// 글 생성 요청
const createPost = async (createPostDto: CreateCommunityPostDto) => {
  const { data } = await axios.post('/community/posts', createPostDto);
  return data;
};

export const useCreatePost = (): UseMutationResult<
any, AxiosError, CreateCommunityPostDto
> => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, CreateCommunityPostDto>(
    createPost,
    {
      onSuccess: (data, createPostDto) => {
        const { platform: platformIndex } = createPostDto;
        const platform = ['afreeca', 'twitch', 'free'][platformIndex];
        queryClient.invalidateQueries(['community', { platform }], { refetchInactive: true });
        ShowSnack('글 작성 성공', 'info', enqueueSnackbar);
        history.push({
          pathname: '/community-board',
        });
      },
      onError: (error) => {
        console.error(error);
        ShowSnack('오류가 발생했습니다. 잠시 후 다시 시도해주세요', 'error', enqueueSnackbar);
      },
    },
  );
};

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
> => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, UpdateProps>(
    updatePost,
    {
      onSuccess: (data, props) => {
        const { postId } = props;
        queryClient.invalidateQueries(['post', postId]);
        queryClient.invalidateQueries(['community'], { refetchInactive: true });
        ShowSnack('글 수정 성공', 'info', enqueueSnackbar);
        history.goBack();
      },
      onError: (error) => {
        console.error(error);
        ShowSnack('오류가 발생했습니다. 잠시 후 다시 시도해주세요', 'error', enqueueSnackbar);
      },
    },
  );
};
