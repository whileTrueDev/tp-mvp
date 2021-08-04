import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

type Props = {
  replyId: number,
  suggestionId: number
}

async function deleteFeatureSuggestionReply(props: Props) {
  const { replyId } = props;
  const res = await axios.delete('/feature-suggestion/reply', { data: { id: replyId } });
  return res.data;
}

export function useDeleteFeatureReply(): UseMutationResult<any, AxiosError, Props> {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, Props>(
    deleteFeatureSuggestionReply,
    {
      onSuccess: (result, props) => {
        const { suggestionId } = props;
        queryClient.invalidateQueries(['featureSuggestion', `${suggestionId}`]);
        queryClient.invalidateQueries('featureSuggestionList');
      },
    },
  );
}
