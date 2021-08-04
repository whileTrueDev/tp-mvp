import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { FeatureSuggestionPostDto } from '@truepoint/shared/dist/dto/featureSuggestion/featureSuggestionPost.dto';
import { FeatureSuggestionPatchDto } from '@truepoint/shared/dist/dto/featureSuggestion/featureSuggestionPatch.dto';
import { AxiosError } from 'axios';
import axios from '../../axios';

// feature suggestion post
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

// feature suggestion patch
async function editFeatureSuggestion(data: FeatureSuggestionPatchDto) {
  const res = await axios.patch('/feature-suggestion', data);
  return res.data;
}

export function useEditFeatureSuggestion(): UseMutationResult<any, AxiosError, FeatureSuggestionPatchDto> {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, FeatureSuggestionPatchDto>(
    editFeatureSuggestion,
    {
      onSuccess: (result, dto) => {
        const { suggestionId } = dto;
        // 쿼리키에서 suggestionId string으로 저장되어있음
        queryClient.invalidateQueries(['featureSuggestion', `${suggestionId}`], {
          refetchInactive: true,
        });
        queryClient.invalidateQueries('featureSuggestionList', { refetchInactive: true });
      },
    },
  );
}
