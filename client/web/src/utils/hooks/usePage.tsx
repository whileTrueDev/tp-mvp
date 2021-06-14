import { useState, useEffect } from 'react';

export function usePage({ defaultItemPerPage }: {defaultItemPerPage: number}): {
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  itemPerPage: number,
  setItemPerPage: React.Dispatch<React.SetStateAction<number>>,
  handlePageChange: (event: React.ChangeEvent<unknown>, newPage: number) => void
} {
  const [page, setPage] = useState<number>(1);
  const [itemPerPage, setItemPerPage] = useState<number>(defaultItemPerPage);

  useEffect(() => {
    setItemPerPage(defaultItemPerPage);
    setPage(1);
  }, [defaultItemPerPage]);

  const handleChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  return {
    page,
    setPage,
    itemPerPage,
    setItemPerPage,
    handlePageChange: handleChange,
  };
}
