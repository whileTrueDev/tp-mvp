import { useEffect, useState } from 'react';
import axios from 'axios';
import { VideoListItemType } from './VideoListTable';

const vidoeListUrl = 'https://joni-pilot.glitch.me/videos/';

export default function useVideoDataSerach(pageNumber: number, period: Date[], dataPerPage: number): {
  loading: boolean;
  error: boolean;
  videos: VideoListItemType[];
  hasMore: boolean;
} {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [videos, setVideos] = useState<VideoListItemType[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    setVideos([]);
  }, [period]);

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
    }; // 컴포넌트 언마운트시(리렌더링 전) ignore = true하여 언마운트 이후 가져온 데이터는 추가하지 않음
  },
  [pageNumber, period, dataPerPage]);

  return {
    loading, error, videos, hasMore,
  };
}
