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
    paddingInlineStart: 0,
  },
  item: {
    borderRadius: theme.spacing(1),
    '&.Mui-selected': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
  },
  buttonStyle: { padding: '0 6px', height: 32 },
  sizeSmall: {
    minWidth: 26,
    height: 26,
    borderRadius: 26 / 2,
    margin: '0 1px',
    padding: '0 4px',
    fontSize: theme.spacing(1.5),
  },
  sizeLarge: {
    minWidth: 40,
    height: 40,
    borderRadius: 40 / 2,
    padding: '0 10px',
    fontSize: theme.typography.pxToRem(15),
  },
}));

export interface CustomPatinationProps extends UsePaginationProps{
  className?: string,
  size?: 'medium' | 'small' | 'large'
}

export default function CustomPagination(props: CustomPatinationProps): JSX.Element {
  const {
    className, size = 'medium', ...paginationProps
  } = props;
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
                size={size}
                {...item}
              />
            );
          } else if (type === 'first') {
            children = (
              <Button
                {...item}
                className={classnames(
                  classes.buttonStyle,
                  { [classes.sizeSmall]: size === 'small' },
                  { [classes.sizeLarge]: size === 'large' },
                )}
                startIcon={<NavigateBeforeIcon />}
              >
                첫페이지
              </Button>
            );
          } else if (type === 'last') {
            children = (
              <Button
                {...item}
                className={classnames(
                  classes.buttonStyle,
                  { [classes.sizeSmall]: size === 'small' },
                  { [classes.sizeLarge]: size === 'large' },
                )}
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
