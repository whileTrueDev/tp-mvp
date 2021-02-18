import React, { useState } from 'react';

export type FilterType = 'all'|'notice'|'recommended';

interface BoardListState{
  posts: any[];
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
}

export default function useBoardListState(): BoardListState {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [currentPostId, setCurrentPostId] = useState<number|null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const pagenationHandler = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (page === newPage) return;
    setPage(newPage);
  };

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
  };
}
