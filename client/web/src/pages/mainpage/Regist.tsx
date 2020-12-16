import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '../../organisms/mainpage/regist/Stepper';
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
    },
  },
}));

export default function Login(): JSX.Element {
  const classes = useStyles();
  useScrollTop();
  return (
    <section className={classes.container}>
      {/* 왼쪽 빈 공간 */}
      {/* 오른쪽 로그인 공간 */}
      <section
        className={classes.section}
      >
        <div className={classes.centerflex}>
          <Stepper />
        </div>
      </section>

    </section>
  );
}
