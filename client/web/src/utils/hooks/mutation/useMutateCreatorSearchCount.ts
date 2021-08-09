import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { useHistory } from 'react-router';
import axios from '../../axios';

async function increaseCreatorSearch(creatorId: string) {
  const res = await axios.post('users/creator-list', { creatorId });
  return res.data;
}

export default function useMutateCreatorSearchCount(): UseMutationResult<User, AxiosError, string> {
  const history = useHistory();
  const queryClient = useQueryClient();
  return useMutation<User, AxiosError, string>(
    increaseCreatorSearch,
    {
      onSuccess: (user, creatorId) => {
        queryClient.invalidateQueries(['creatorSearch']);
        queryClient.invalidateQueries('mostSearchedCreators');
        history.push(`/ranking/creator/${creatorId}`);
      },
    },
  );
}
