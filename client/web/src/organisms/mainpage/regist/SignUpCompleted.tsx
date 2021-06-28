import classnames from 'classnames';
import {
  Button, makeStyles, Typography,
} from '@material-ui/core';
import { Done } from '@material-ui/icons';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 550,
    minWidth: 200,
    [theme.breakpoints.down('sm')]: {
      maxWidth: 210,
    },
  },
  successSection: {
    width: 180,
    height: 130,
    background: 'no-repeat center url(/images/main/paper_pollen.gif)',
    backgroundSize: 'cover',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  icon: {
    fontSize: 80,
    color: theme.palette.common.white,
    padding: 16,
    backgroundColor: theme.palette.success.light,
    borderRadius: '50%',
  },
  bold: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.body1.fontSize,
    },
  },
  normal: {
    fontSize: theme.typography.body2.fontSize,
    wordBreak: 'keep-all',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(1.5),
    },
  },
  emphasizedText: { textDecoration: 'underline', color: theme.palette.primary.main },
  buttonSet: {
    width: '80%',
    marginTop: theme.spacing(6),
  },
  button: { width: '100%', padding: theme.spacing(1.5), marginBottom: theme.spacing(1) },
}));

export interface SignUpCompletedProps {
  generatedUserId: string;
}
export default function SignUpCompleted({
  generatedUserId,
}: SignUpCompletedProps): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.successSection}>
        <Done className={classes.icon} />
      </div>

      <br />
      <Typography className={classes.bold}>회원가입이 완료되었습니다.</Typography>
      <br />
      <Typography className={classes.normal}>트루포인트 회원가입을 진심으로 축하드립니다.</Typography>
      <Typography className={classes.normal}>
        가입하신 아이디는
        {' '}
        <Typography variant="body1" component="span" className={classnames(classes.emphasizedText, classes.bold)}>
          {generatedUserId}
        </Typography>
        {' '}
        입니다.
      </Typography>

      <div className={classes.buttonSet}>
        <Button className={classes.button} component={Link} to="/" variant="outlined" color="primary">메인화면</Button>
        <Button className={classes.button} component={Link} to="/login" variant="contained" color="primary">로그인</Button>
      </div>
    </div>
  );
}
