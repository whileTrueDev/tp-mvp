import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { RatingPostDto } from '@truepoint/shared/dist/dto/creatorRatings/ratings.dto';
import { CreatorRatings } from '@truepoint/shared/dist/interfaces/CreatorRatings.interface';
import { AxiosError } from 'axios';
import axios from '../../axios';

type Tvariable = {
  creatorId: string,
  ratingPostDto: RatingPostDto,
  callback?: () => void
}
async function upsertRating(props: Tvariable) {
  const { creatorId, ratingPostDto } = props;
  const res = await axios.post(`/ratings/${creatorId}`, ratingPostDto);
  return res.data;
}

export default function useMutateRating(): UseMutationResult<CreatorRatings, AxiosError, Tvariable> {
  const queryClient = useQueryClient();
  return useMutation<CreatorRatings, AxiosError, Tvariable>(
    upsertRating,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('creatorAverageRatings');
      },
      onError: (error) => console.error(error),
      onSettled: (data, error, variables) => {
        const { callback } = variables;
        if (callback) callback();
      },
    },
  );
}
