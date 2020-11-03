import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import LoginForm from '../../organisms/mainpage/login/LoginForm';
import LoginFooter from '../../organisms/shared/FooterShort';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    background: `url('images/main/loginpage.png'), linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    height: '100vh',
  },
  centerflex: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: `${theme.palette.background.default}`,
    alignItems: 'center',
    height: '95vh',
  },
  section: {
    height: '100%',
    backgroundColor: `${theme.palette.background.default}`,
  },
}));

export default function Login(): JSX.Element {
  const classes = useStyles();

  const isDesktop = useMediaQuery('(min-width:768px)');

  return (
    <section className={classes.container}>
      <section style={{ width: isDesktop ? '40%' : '100%' }} className={classes.section}>
        <div className={classes.centerflex}>
          <LoginForm />
        </div>
        <LoginFooter />
      </section>
    </section>
  );
}
