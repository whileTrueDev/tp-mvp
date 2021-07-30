import { useMutation, UseMutationResult } from 'react-query';
import { AxiosError } from 'axios';
import { CreateCommentDto } from '@truepoint/shared/dist/dto/creatorComment/createComment.dto';
import { CreatorComments } from '@truepoint/shared/dist/interfaces/CreatorComments.interface';
import axios from '../../axios';

type Variables = {
  url: string,
  createCommentDto: CreateCommentDto,
  callback?: () => void
}

async function addComment(props: Variables) {
  const { url, createCommentDto } = props;
  const res = await axios.post(url, { ...createCommentDto });
  return res.data;
}

export default function useMutateCreatorComment(): UseMutationResult<CreatorComments, AxiosError, Variables> {
  return useMutation<CreatorComments, AxiosError, Variables>(
    addComment,
    {
      onSuccess: (comment, variables) => {
        const { callback } = variables;
        if (callback) callback();
      },
    },
  );
}
