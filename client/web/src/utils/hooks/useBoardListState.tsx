import React, { useCallback, useMemo, useState } from 'react';
import { PostFound, FindPostResType } from '@truepoint/shared/dist/res/FindPostResType.interface';

export type FilterType = 'all'|'notice'|'recommended';

interface BoardListState{
  posts: PostFound[];
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalRows: number;
  setTotalRows: React.Dispatch<React.SetStateAction<number>>;
  currentPostId: number | null;
  setCurrentPostId: React.Dispatch<React.SetStateAction<number | null>>
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  pagenationHandler: (event: React.ChangeEvent<unknown>, newPage: number) => void;
  handlePostsLoad: ({ posts, total }: FindPostResType) => void;
  changeFilter: (categoryFilter: FilterType) => void;
  initializeFilter: () => void;
  boardState: {
    posts: PostFound[];
    page: number;
    totalRows: number;
    filter: FilterType;
}
}

export default function useBoardListState({
  page: initialPage,
}: {
  page?: number
}): BoardListState {
  const [posts, setPosts] = useState<PostFound[]>([]);
  const [page, setPage] = useState<number>(initialPage || 1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [currentPostId, setCurrentPostId] = useState<number|null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const pagenationHandler = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (page === newPage) return;
    setPage(newPage);
  };

  const handlePostsLoad = useCallback(({
    posts: loadedPosts,
    total,
  }: FindPostResType) => {
    setTotalRows(total);
    setPosts(loadedPosts);
  }, []);

  const changeFilter = useCallback((categoryFilter: FilterType) => {
    setPage(1);
    setFilter(categoryFilter);
  }, []);

  const initializeFilter = useCallback(() => {
    changeFilter('all');
  }, [changeFilter]);

  const boardState = useMemo(() => ({
    posts,
    page,
    totalRows,
    filter,
  }), [filter, page, posts, totalRows]);
  return {
    posts,
    setPosts,
    page,
    setPage,
    totalRows,
    setTotalRows,
    currentPostId,
    setCurrentPostId,
    filter,
    setFilter,
    pagenationHandler,
    handlePostsLoad,
    changeFilter,
    initializeFilter,
    boardState,
  };
}
