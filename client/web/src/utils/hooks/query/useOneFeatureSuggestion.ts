import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';
import axios from '../../axios';

const getOneFeatureSuggestion = async (suggestionId: string) => {
  const { data } = await axios.get<FeatureSuggestion>('/feature-suggestion', {
    params: {
      id: suggestionId,
    },
  });
  return data;
};

export default function useOneFeatureSuggestion(
  suggestionId: string,
  options?: UseQueryOptions<FeatureSuggestion>,
): UseQueryResult<FeatureSuggestion> {
  return useQuery(
    ['featureSuggestion', suggestionId],
    () => getOneFeatureSuggestion(suggestionId),
    options,
  );
}
