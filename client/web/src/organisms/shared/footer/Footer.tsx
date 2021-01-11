import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import {
  Container, Grid, Typography, Button, useTheme,
} from '@material-ui/core';

const styles = makeStyles((theme) => ({
  root: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    margin: '20px auto',
  },
  iconsWrapper: {
    height: 60,
    marginTop: 10,
    marginBottom: 20,
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
  name: {
    fontWeight: 700,
    fontSize: 15,
    [theme.breakpoints.down('sm')]: {
      width: 20,
      fontSize: 15,
    },
  },
  address: {
    marginLeft: '7px',
    marginRight: '20px',
    marginTop: 5,
    marginBottom: 5,
    fontSize: '15px',
    fontWeight: 300,
  },
  addressTitle: {

    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    fontSize: '15px',
    '& div': {
      display: 'inline-table',
    },
  },
  addressLocation: {

    fontWeight: 300,
    fontSize: '15px',
  },
  list: {
    margin: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-start',
    },
  },
  listItem: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginLeft: 30,
    '&:hover': {
      fontWeight: 'bold',
    },
    '&>a': {
      fontWeight: 300,
      padding: 0,
      paddingLeft: '15px',
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 15,
    },
  },
  corp: {

    fontWeight: 300,
    marginTop: '15px',
    '& strong': {
      fontWeight: 900,
    },
  },
}));

export default function Footer(): JSX.Element {
  const classes = styles();
  const theme = useTheme();

  return (
    <Container>
      <div className={classes.root}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.iconsWrapper}
        >
          <Grid item md={6} sm={6} xs={12} className={classes.icons}>
            <a href="/" className={classes.icon}>
              {theme.palette.type === 'dark' ? (
                <img src="/images/logo/new_tp_logo_raw.png" id="logo" alt="" width={35} height={35} />
              ) : (
                <img src="/images/logo/new_tp_logo_raw.png" id="logo" alt="" width={35} height={35} />
              )}
            </a>
            <Typography className={classes.name} variant="body2">
              TruePoint
            </Typography>
            <br />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ul className={classes.list}>
              <li>
                <Button component={Link} to="/termsofuse">이용약관</Button>
              </li>
              <li>
                <Button component={Link} to="/privacypolicy" style={{ fontWeight: 'bold' }}>개인정보 처리방침</Button>
              </li>
            </ul>
          </Grid>
        </Grid>

        <Grid container>
          <Typography variant="caption" className={classes.addressLocation}>
            부산광역시 금정구 장전온천천로 51 테라스파크 3층 313호 와일트루
          </Typography>
        </Grid>

        <Grid container>
          <Typography variant="caption" className={classes.addressTitle}>
            {/* 제거 요청 2020. 11. 27 from walker */}
            {/* <div>
              대표명
              <span className={classes.address}>강동기</span>
            </div> */}
            <div>
              이메일
              <span className={classes.address}>truepointceo@gmail.com</span>
            </div>
            {/* <div>
              사업자등록번호
              <span className={classes.address}>659-03-01549</span>
            </div>
            <div>
              통신판매업 신고번호
              <span className={classes.address}>제2019-부산금정-0581호</span>
            </div> */}
            <div>
              개인정보보호책임자
              <span className={classes.address}>강태섭</span>
            </div>
            <div>
              고객센터
              <span className={classes.address}>051-515-6309</span>
            </div>
          </Typography>
        </Grid>

        <Typography variant="caption" className={classes.corp}>
          <strong>
            &copy;
            WhileTrue Corp.
          </strong>
          {' All rights Reserved'}
        </Typography>
      </div>
    </Container>
  );
}
