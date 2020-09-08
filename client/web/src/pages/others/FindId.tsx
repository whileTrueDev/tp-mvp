import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import LoginFooter from '../../organisms/shared/FooterShort';
import FindIdForm from '../../organisms/mainpage/login/FindIdForm';

const useStyles = makeStyles((theme) => ({
  container: { display: 'flex', height: '100vh', },
  leftside: {
    width: '50%',
    background: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.light})`
  },
  centerflex: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default function FindId():JSX.Element {
  const classes = useStyles();
  const isDesktop = useMediaQuery('(min-width:768px)');

  return (
    <section className={classes.container}>
      {/* 왼쪽 빈 공간 */}
      {isDesktop && (<div className={classes.leftside} />)}
      {/* 오른쪽 로그인 공간 */}
      <div
        className={classes.centerflex}
        style={{ width: isDesktop ? '50%' : '100%' }}
      >
        <FindIdForm />
        <LoginFooter />
      </div>
    </section>
  );
}
