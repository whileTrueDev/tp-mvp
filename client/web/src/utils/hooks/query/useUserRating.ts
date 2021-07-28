import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

const getUserRating = async ({ creatorId, userId }: {
  creatorId?: string,
  userId: string
}) => {
  const { data } = await axios.get<{score: number} | false>(`ratings/${creatorId}`, {
    params: { userId },
  });
  return data;
};

export default function useUserRating({ creatorId, userId }: {
  creatorId?: string,
  userId: string
}): UseQueryResult<{score: number} | false, AxiosError> {
  const enabled = Boolean(userId) && Boolean(creatorId);
  return useQuery<{score: number} | false, AxiosError>(
    ['userRating', { creatorId, userId }],
    () => getUserRating({ creatorId, userId }),
    {
      enabled: Boolean(userId) && Boolean(creatorId),
      cacheTime: !enabled ? 0 : 1000 * 60 * 5,
      staleTime: 1000 * 60,
    },
  );
}
