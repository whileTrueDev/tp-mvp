import React, { useState } from 'react';

export type FilterType = 'all'|'notice'|'recommended';
export default function useBoardState() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [currentPostId, setCurrentPostId] = useState<number|null>();
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
