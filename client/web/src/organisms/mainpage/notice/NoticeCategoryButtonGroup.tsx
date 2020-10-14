import React from 'react';
import classnames from 'classnames';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    height: 80,
    backgroundColor: theme.palette.action.disabledBackground,
  },
  button: {
    width: '25%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 0,
    boxShadow: 'none',
  },
  selected: { backgroundColor: theme.palette.primary.dark },
  selectedText: { fontWeight: 'bold' },
}));

export interface NoticeCategoryButtonGroupProps {
  onChange: (str: string) => void;
  selected: string;
  categories: string[];
}
export default function NoticeCategoryButtonGroup({
  onChange, selected, categories,
}: NoticeCategoryButtonGroupProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {['전체'].concat(categories).map((category) => (
        <Button
          key={category}
          onClick={() => {
            onChange(category);
          }}
          variant={selected === category ? 'contained' : 'outlined'}
          color={selected === category ? 'primary' : 'default'}
          className={classnames({
            [classes.button]: true,
          })}
        >
          <Typography className={classnames({ [classes.selectedText]: selected === category })}>
            {category}
          </Typography>
        </Button>
      ))}
    </div>
  );
}
