import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { FeatureSuggestionPostDto } from '@truepoint/shared/dist/dto/featureSuggestion/featureSuggestionPost.dto';
import { AxiosError } from 'axios';
import axios from '../../axios';

async function addFeatureSuggestion(data: FeatureSuggestionPostDto) {
  const res = await axios.post('/feature-suggestion', data);
  return res.data;
}

export function useCreateFeatureSuggestion(): UseMutationResult<any, AxiosError, FeatureSuggestionPostDto> {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, FeatureSuggestionPostDto>(
    addFeatureSuggestion,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('featureSuggestionList', { refetchInactive: true });
      },
    },
  );
}
