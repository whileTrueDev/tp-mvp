import React from 'react';
import classnames from 'classnames';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    height: 60,
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
      flexWrap: 'wrap',
    },
  },
  button: {
    width: '25%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 0,
    boxShadow: theme.shadows[0],
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[100] : theme.palette.background.default,
    [theme.breakpoints.down('sm')]: {
      width: '50%',
    },
  },
  selected: {
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[0],
    },
    cursor: 'default',
  },
  text: {
    fontSize: theme.typography.h6.fontSize,
    wordBreak: 'keep-all',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.body1.fontSize,
    },
  },
  selectedText: { fontWeight: 'bold' },
}));

export interface NoticeCategoryButtonGroupProps {
  onChange: (str: string) => void;
  selected: string;
  categories: string[];
}
export default function FeatureCategoryButtonGroup({
  onChange, selected, categories,
}: NoticeCategoryButtonGroupProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {['전체'].concat(categories).map((category) => (
        <Button
          key={category}
          onClick={() => {
            if (!(category === selected)) {
              onChange(category);
            }
          }}
          variant="outlined"
          className={classnames({
            [classes.button]: true,
            [classes.selected]: selected === category,
          })}
        >
          <Typography component="div" className={classnames(classes.text, { [classes.selectedText]: selected === category })}>
            {category}
          </Typography>
        </Button>
      ))}
    </div>
  );
}
