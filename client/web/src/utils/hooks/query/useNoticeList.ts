import { useQuery, UseQueryResult } from 'react-query';
import { Notice as NoticeData } from '@truepoint/shared/dist/interfaces/Notice.interface';
import { AxiosError } from 'axios';
import axios from '../../axios';

const getNoticeList = async () => {
  const { data } = await axios.get('/notice');
  return data;
};

export default function useNoticeList(): UseQueryResult<NoticeData[], AxiosError> {
  return useQuery(['noticeList'], getNoticeList);
}
