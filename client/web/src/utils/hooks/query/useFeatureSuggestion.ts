import { useQuery, UseQueryResult } from 'react-query';
import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';
import { AxiosError } from 'axios';
import axios from '../../axios';

// 기능제안 목록 조회
const getFeatureSuggestionList = async () => {
  const { data } = await axios.get('/feature-suggestion/list');
  return data;
};

export function useFeatureSuggestionList(): UseQueryResult<
Omit<FeatureSuggestion, 'content' | 'replies'>[],
AxiosError
> {
  return useQuery(
    ['featureSuggestionList'],
    getFeatureSuggestionList,
  );
}
