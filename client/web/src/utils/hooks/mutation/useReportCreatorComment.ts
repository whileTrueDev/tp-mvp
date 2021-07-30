import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export default function useReportCreatorComment(): UseMutationResult<any, Error, string> {
  return useMutation(
    async (url: string) => {
      const res = await axios.post(url);
      return res.data;
    },
  );
}
