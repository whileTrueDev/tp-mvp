import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LoginForm from '../../organisms/mainpage/login/LoginForm';
import LoginFooter from '../../organisms/shared/FooterShort';
import useScrollTop from '../../utils/hooks/useScrollTop';

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
    width: '40%',
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    [theme.breakpoints.down('lg')]: {
      width: '50%',
    },
    [theme.breakpoints.down('md')]: {
      width: '70%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: 0,
    },
  },
}));

export default function Login(): JSX.Element {
  const classes = useStyles();

  // 처음 페이지 렌더링시 화면 최상단으로 스크롤이동
  useScrollTop();
  return (
    <section className={classes.container}>
      <section
        className={classes.section}
      >
        <div className={classes.centerflex}>
          <LoginForm />
        </div>
        <LoginFooter />
      </section>
    </section>
  );
}
