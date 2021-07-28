import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { CreatorAverageRatings } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import axios from '../../axios';

const getCreatorAverageRatings = async (creatorId: string) => {
  const { data } = await axios.get(`/ratings/${creatorId}/average`);
  return data;
};

export default function useCreatorAverageRatings(
  creatorId: string,
): UseQueryResult<CreatorAverageRatings, AxiosError> {
  return useQuery<CreatorAverageRatings, AxiosError>(
    ['creatorAverageRatings', creatorId],
    () => getCreatorAverageRatings(creatorId),
    {
      enabled: !!creatorId,
      placeholderData: { average: 0, count: 0 },
    },
  );
}
