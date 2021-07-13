import React from 'react';
import { usePagination, UsePaginationProps } from '@material-ui/lab/Pagination';
import { PaginationItem } from '@material-ui/lab';
import { Button } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import classnames from 'classnames';

const useStyles = makeStyles((theme: Theme) => createStyles({
  ul: {
    listStyle: 'none',
    display: 'flex',
  },
  item: {
    borderRadius: theme.spacing(1),
    '&.Mui-selected': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },

  },
}));

interface CustomPatinationProps extends UsePaginationProps{
  className?: string,
}

export default function CustomPagination(props: CustomPatinationProps): JSX.Element {
  const { className, ...paginationProps } = props;
  const classes = useStyles();
  const { items } = usePagination({ ...paginationProps });

  return (
    <nav>
      <ul className={classnames(classes.ul, className)}>
        {items.map(({
          page, type, selected, ...item
        }, index) => {
          const key = `${type}_${index}`;
          let children = null;

          if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            children = '…';
          } else if (type === 'page' || type === 'previous' || type === 'next') {
            children = (
              <PaginationItem
                className={classes.item}
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

          return <li key={key}>{children}</li>;
        })}
      </ul>
    </nav>
  );
}
