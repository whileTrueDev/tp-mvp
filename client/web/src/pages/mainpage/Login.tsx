import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import LoginForm from '../../organisms/mainpage/login/LoginForm';
import LoginFooter from '../../organisms/shared/FooterShort';

const useStyles = makeStyles((theme) => ({
  container: { display: 'flex', height: '100vh' },
  leftside: {
    width: '50%',
    background: `url('images/main/loginpage.png'), linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    backgroundSize: 'cover',
    backgroundPosition: 'bottom',
    backgroundRepeat: 'no-repeat',
  },
  centerflex: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: '90vh',
  },
}));

export default function Login():JSX.Element {
  const classes = useStyles();
  const isDesktop = useMediaQuery('(min-width:768px)');

  return (
    <section className={classes.container}>
      {/* 왼쪽 빈 공간 */}
      {isDesktop && (<section className={classes.leftside} />)}
      {/* 오른쪽 로그인 공간 */}
      <section style={{ width: isDesktop ? '50%' : '100%' }}>
        <div className={classes.centerflex}>
          <LoginForm />
        </div>
        <LoginFooter />
      </section>

    </section>
  );
}
