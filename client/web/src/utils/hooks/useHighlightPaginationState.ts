import { useState, useRef, useEffect } from 'react';
import { forceCheck } from 'react-lazyload';
import { HighlightPointListResType } from '@truepoint/shared/dist/res/HighlightPointListResType.interface';
import useHighlightSearchList from './query/useHighlightSearchList';

interface PaginationState {
  searchText: string,
  take: number,
  inputRef: React.MutableRefObject<HTMLInputElement | undefined>,
  doSearch: () => void,
  clearSearchText: () => void,
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void,
  data: HighlightPointListResType | undefined,
  isFetching: boolean,
}

interface Props{
  platform?: 'afreeca'| 'twitch',
  itemPerPage?: number;
}
export const useHighlightPaginationState = (props: Props): PaginationState => {
  const { itemPerPage = 30, platform = 'afreeca' } = props;
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(itemPerPage);
  const [search, setSearch] = useState(''); // 검색어
  const [searchText, setSearchedText] = useState(''); // 검색했던 내용 (검색 후 인풋창에 표시)
  const inputRef = useRef<HTMLInputElement>();

  const { data, error: queryError, isFetching } = useHighlightSearchList({
    platform, page, take, search,
  }, forceCheck);

  if (queryError) {
    console.error(queryError);
  }

  useEffect(() => {
    if (!search) return;
    if (data && (page > data?.totalPage)) {
      setPage(1);
    }
  }, [data, page, search]);

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
    setPage(1);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    window.scrollTo(0, 0);
    setPage(value);
  };

  return {
    doSearch,
    searchText,
    clearSearchText,
    handlePageChange,
    take,
    inputRef,
    data,
    isFetching,
  };
};