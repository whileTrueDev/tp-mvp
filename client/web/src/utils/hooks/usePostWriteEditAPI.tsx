import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
import { AxiosResponse } from 'axios';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import ShowSnack from '../../atoms/snackbar/ShowSnack';
import { useCreatePost, useUpdatePost } from './mutation/useMutatePost';

/**
 * CommunityPostWrite 컴포넌트에서 사용되는 axios 요청 핸들러
 * @param postId 
 * 
 * @return handleLoadPost : 글 수정시 postId인 글 불러오는 핸들러 get요청
 * @return handleCreatePost : 글 생성 핸들러 post요청
 * @return handleEditPost: 글 수정 핸들러 post요청
 */
export default function usePostWriteEditAPI(postId: number): {
  handleLoadPost: (cb: (res: AxiosResponse<any>) => void) => void;
  handleCreatePost: (createPostDto: CreateCommunityPostDto) => void;
  handleEditPost: (updatePostDto: UpdateCommunityPostDto) => void;
} {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [, getPostForEdit] = useAxios({ url: `/community/posts/${postId}` }, { manual: true });
  const queryClient = useQueryClient();
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: editPost } = useUpdatePost();

  const handleLoadPost = useCallback((cb: (res: AxiosResponse<any>) => void) => {
    getPostForEdit()
      .then((res) => {
        cb(res);
      })
      .catch((e) => {
        console.error(e);
        if (e.response.status === 400) {
          ShowSnack('해당글이 존재하지 않습니다', 'error', enqueueSnackbar);
        } else {
          ShowSnack('글 불러오기 오류', 'error', enqueueSnackbar);
        }
        history.push({
          pathname: '/community-board',
        });
      });
  }, [enqueueSnackbar, getPostForEdit, history]);

  const handleCreatePost = useCallback((createPostDto: CreateCommunityPostDto) => {
    const { platform: platformIndex } = createPostDto;
    const platform = ['afreeca', 'twitch', 'free'][platformIndex];
    createPost(createPostDto)
      .then((res) => {
        queryClient.invalidateQueries(['community', { platform }], { refetchInactive: true });
        ShowSnack('글 작성 성공', 'info', enqueueSnackbar);
        history.push({
          pathname: '/community-board',
        });
      })
      .catch((error) => {
        console.error(error);
        ShowSnack('오류가 발생했습니다. 잠시 후 다시 시도해주세요', 'error', enqueueSnackbar);
      });
  }, [createPost, enqueueSnackbar, history, queryClient]);

  const handleEditPost = useCallback((updatePostDto: UpdateCommunityPostDto) => {
    editPost({ postId, updatePostDto })
      .then(() => {
        queryClient.invalidateQueries(['post', postId]);
        queryClient.invalidateQueries(['community'], { refetchInactive: true });
        ShowSnack('글 수정 성공', 'info', enqueueSnackbar);
        history.goBack();
      })
      .catch((error) => {
        console.error(error);
        ShowSnack('오류가 발생했습니다. 잠시 후 다시 시도해주세요', 'error', enqueueSnackbar);
      });
  }, [editPost, enqueueSnackbar, history, postId, queryClient]);

  return {
    handleLoadPost, handleCreatePost, handleEditPost,
  };
}
