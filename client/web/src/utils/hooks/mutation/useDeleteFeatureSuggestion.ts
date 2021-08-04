import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

type DeleteConfigData = {
  data: {
    id: string
  }
}

async function deleteFeatureSuggestion(data: DeleteConfigData) {
  const res = await axios.delete('/feature-suggestion', data);
  return res.data;
}

export default function useDeleteFeatureSuggestion(): UseMutationResult<number, AxiosError, DeleteConfigData> {
  const queryClient = useQueryClient();
  return useMutation<number, AxiosError, DeleteConfigData>(
    deleteFeatureSuggestion,
    {
      onSuccess: (result, deleteConfigData) => {
        const { id } = deleteConfigData.data;
        // 상세보기 데이터 캐시 삭제
        queryClient.removeQueries(['featureSuggestion', id], { exact: true });
        queryClient.invalidateQueries('featureSuggestionList');
      },
    },
  );
}
