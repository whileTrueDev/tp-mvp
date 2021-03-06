// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { RefetchOptions } from 'axios-hooks';
import { useState, useRef, useEffect } from 'react';
import { forceCheck } from 'react-lazyload';

interface PaginationState {
  searchText: string,
  take: number,
  inputRef: React.MutableRefObject<HTMLInputElement | undefined>,
  doSearch: () => void,
  clearSearchText: () => void,
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number
) => void,
}

interface Props{
  getList: (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>,
  itemPerPage?: number;
}
export const usePaginationState = (props: Props): PaginationState => {
  const { getList, itemPerPage = 30 } = props;
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(itemPerPage);
  const [search, setSearch] = useState(''); // 검색어
  const [searchText, setSearchedText] = useState(''); // 검색했던 내용 (검색 후 인풋창에 표시)
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => setTake(itemPerPage), [itemPerPage]);

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
    }).then((res) => {
      // 목록 새로 불러온 후 아바타 이미지가 뷰포트에 들어와 있는지 재확인하여 lazyloading
      forceCheck();
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
    doSearch,
    searchText,
    clearSearchText,
    handlePageChange,
    take,
    inputRef,
  };
};
