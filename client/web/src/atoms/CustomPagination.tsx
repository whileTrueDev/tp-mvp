import React from 'react';
import { usePagination, UsePaginationProps } from '@material-ui/lab/Pagination';
import { PaginationItem } from '@material-ui/lab';
import { Button } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme: Theme) => createStyles({
  ul: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
  },
  item: {
    color: theme.palette.action.disabled,
    '&.Mui-selected': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },

  },
}));

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
              <PaginationItem
                className={classes.item}
                shape="rounded"
                variant="outlined"
                page={page}
                type={type}
                selected={selected}
                {...item}
              />
            );
          } else if (type === 'first') {
            children = (
              <Button
                {...item}
                style={{ padding: '0 6px', height: 32 }}
                startIcon={<NavigateBeforeIcon />}
              >
                첫페이지
              </Button>
            );
          } else if (type === 'last') {
            children = (
              <Button
                {...item}
                style={{ padding: '0 6px', height: 32 }}
                endIcon={<NavigateNextIcon />}
              >
                끝페이지
              </Button>
            );
          }

          // eslint-disable-next-line react/no-array-index-key
          return <li key={index}>{children}</li>;
        })}
      </ul>
    </nav>
  );
}
