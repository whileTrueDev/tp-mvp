import Axios from 'axios';
import useAxios from 'axios-hooks';
import { useState, useRef, useEffect } from 'react';
import { HighlightPointListResType } from '../../../../../shared/dist/res/HighlightPointListResType.interface';

export const useHighlightListContainerState = (platform: 'afreeca' | 'twitch'): {
  data: HighlightPointListResType | undefined,
  loading: boolean,
  searchText: string,
  take: number,
  inputRef: React.MutableRefObject<HTMLInputElement | undefined>,
  doSearch: () => void,
  clearSearchText: () => void,
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void,
} => {
  const url = `/highlight/highlight-point-list/${platform}`;
  const [{ loading, data }, getList] = useAxios<HighlightPointListResType>({ url }, { manual: true });
  const [page, setPage] = useState(1);
  const [take] = useState(30);
  const [search, setSearch] = useState(''); // 검색어
  const [searchText, setSearchedText] = useState(''); // 검색했던 내용 (검색 후 인풋창에 표시)
  const inputRef = useRef<HTMLInputElement>();

  const doSearch = () => {
    if (inputRef.current) {
      const text = inputRef.current.value;
      setSearchedText(text);
      setSearch(text);
    }
  };

  const clearSearchText = () => {
    setSearchedText('');
    setSearch('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    window.scrollTo(0, 0);
    setPage(value);
  };

  // page 변경시 재요청
  useEffect(() => {
    getList({
      params: {
        page,
        take,
        search,
      },
    }).catch((error) => {
      if (!Axios.isCancel(error)) {
        console.error(error);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getList, page, take]);

  // search 변경시 첫페이지 요청
  useEffect(() => {
    getList({
      params: {
        page: 1,
        take,
        search,
      },
    }).catch((error) => {
      if (!Axios.isCancel(error)) {
        console.error(error);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getList, search]);

  // 마운트 후 실행
  useEffect(() => {
    getList().catch((error) => {
      if (!Axios.isCancel(error)) {
        console.error(error);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    doSearch, searchText, clearSearchText, data, loading, handlePageChange, take, inputRef,
  };
};
