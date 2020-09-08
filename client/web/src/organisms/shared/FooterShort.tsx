import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  footer: {
    position: 'absolute',
    bottom: 20,
  },
  centerflex: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default function FooterShort():JSX.Element {
  const classes = useStyles();
  return (

    <div className={classnames(classes.centerflex, classes.footer)}>
      <div>
        <Button component={Link} to="/termsofuse">이용약관</Button>
        <Button component={Link} to="/privacypolicy" style={{ fontWeight: 'bold' }}>개인정보 처리방침</Button>
      </div>
      <Typography variant="caption">Copyright © WhileTrue Corp. All rights reserved.</Typography>
    </div>
  );
}
