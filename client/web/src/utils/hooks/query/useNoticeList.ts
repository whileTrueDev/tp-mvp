import { useQuery, UseQueryResult } from 'react-query';
import { Notice as NoticeData } from '@truepoint/shared/dist/interfaces/Notice.interface';
import { AxiosError } from 'axios';
import axios from '../../axios';

// 공지사항 페이지 목록요청
const getNoticeList = async () => {
  const { data } = await axios.get('/notice');
  return data;
};

export default function useNoticeList(): UseQueryResult<NoticeData[], AxiosError> {
  return useQuery(['noticeList'], getNoticeList);
}

// 마이페이지 대시보드 공지사항
async function getNoticeOutline() {
  const { data } = await axios.get('/notice/outline', {
    params: { important: 2 },
  });
  return data;
}

export function useNoticeOutline(): UseQueryResult<NoticeData[], AxiosError> {
  return useQuery(
    ['noticeOutline'],
    getNoticeOutline,
  );
}
