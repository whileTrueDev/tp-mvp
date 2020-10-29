import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footer: {
    maxWidth: 1816, minWidth: 1400, margin: '0 auto',
  },
  footerbox: {
    padding: `${theme.spacing(2)}px 0px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default function MypageFooter(): JSX.Element {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <div className={classes.footerbox}>
        <Typography variant="caption">Copyright © WhileTrue Corp. All rights reserved.</Typography>
        <div>
          <Button component={Link} to="/termsofuse">이용약관</Button>
          <Button component={Link} to="/privacypolicy" style={{ fontWeight: 'bold' }}>개인정보 처리방침</Button>
        </div>
      </div>
    </footer>
  );
}
