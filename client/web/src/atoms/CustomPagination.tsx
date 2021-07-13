import React from 'react';
import { usePagination, UsePaginationProps } from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import { PaginationItem } from '@material-ui/lab';
import { ButtonBase } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles({
  ul: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
  },
});

export default function CustomPagination(props: UsePaginationProps): JSX.Element {
  const classes = useStyles();
  const { items } = usePagination({ ...props });

  return (
    <nav>
      <ul className={classes.ul}>
        {items.map(({
          page, type, selected, ...item
        }, index) => {
          let children = null;

          if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            children = '…';
          } else if (type === 'page' || type === 'previous' || type === 'next') {
            children = (
              <PaginationItem page={page} type={type} selected={selected} {...item} />
            );
          } else {
            children = (
              <ButtonBase
                {...item}
              >
                {type === 'first' && '첫페이지'}
                {type === 'last' && '끝페이지'}
              </ButtonBase>
            );
          }

          // eslint-disable-next-line react/no-array-index-key
          return <li key={index}>{children}</li>;
        })}
      </ul>
    </nav>
  );
}
