import { ReplyPost } from '@truepoint/shared/dist/dto/featureSuggestion/replyPost.dto';
import { FeatureSuggestionReply } from '@truepoint/shared/dist/interfaces/FeatureSuggestionReply.interface';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

const postReply = async (postDto: ReplyPost) => {
  const { data } = await axios.post('/feature-suggestion/reply', postDto);
  return data;
};

export function useCreateFeatureSuggestionReply(): UseMutationResult<FeatureSuggestionReply, AxiosError, ReplyPost> {
  const queryClient = useQueryClient();
  return useMutation(
    postReply,
    {
      onSuccess: (res, dto) => {
        const { suggestionId } = dto;
        queryClient.invalidateQueries(['featureSuggestion', `${suggestionId}`]);
        queryClient.invalidateQueries('featureSuggestionList');
      },
    },
  );
}
