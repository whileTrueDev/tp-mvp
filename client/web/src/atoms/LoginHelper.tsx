import React from 'react';
import classnames from 'classnames';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: 75,
    padding: theme.spacing(2),
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
}));

export interface LoginHelperProps {
  text: string;
  className?: string;
}
export default function LoginHelper(props: LoginHelperProps): JSX.Element {
  const { text, className } = props;
  const classes = useStyles();
  return (
    <div className={classnames(classes.container, className)}>
      {text.split('\n').map((te) => (
        <Typography key={te} variant="body2" style={{ color: 'white' }}>
          {te}
        </Typography>
      )) }

    </div>

  );
}
