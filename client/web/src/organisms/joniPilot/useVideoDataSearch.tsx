import { useEffect, useState } from 'react';
import axios from 'axios';
import { VideoListItemType } from './VideoListTable';

// axios cancelation - 

const vidoeListUrl = 'https://joni-pilot.glitch.me/videos/';

export default function useVideoDataSerach(pageNumber: number, period: Date[], dataPerPage: number): {
  loading: boolean;
  error: boolean;
  videos: VideoListItemType[];
  hasMore: boolean;
} {
  // const cancel = useRef<Canceler|null >();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [videos, setVideos] = useState<VideoListItemType[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    setVideos([]);
  }, [period]);

  // https://codesandbox.io/s/jvvkoo8pq3 ignore
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(false);

    const fetchData = async () => {
      try {
        const res = await axios({
          method: 'GET',
          url: vidoeListUrl,
          params: {
            limit: dataPerPage,
            page: pageNumber,
            startDate: period[0].toISOString(),
            endDate: period[1].toISOString(),
          },
        });

        if (!ignore) {
          setVideos((prevBooks) => Array.from(new Set([...prevBooks, ...res.data.list])));
          setHasMore(res.data.hasMore);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        setError(true);
      }
    };

    fetchData();
    return () => {
      ignore = true;
    }; // 컴포넌트 언마운트시(리렌더링 전) axios 요청 취소 - 모든 타이핑에 대해 요청하지 않는다
  },
  [pageNumber, period, dataPerPage]); // query, pageNumber 바뀔때만 실행됨

  return {
    loading, error, videos, hasMore,
  };
}
