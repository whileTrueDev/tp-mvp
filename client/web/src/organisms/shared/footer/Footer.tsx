import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Link, Typography } from '@material-ui/core';

const styles = makeStyles((theme) => ({
  root: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    margin: '20px auto'
  },
  iconsWrapper: {
    height: 30,
    marginTop: 10,
    marginBottom: 20
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
    fontFamily: 'Noto Sans KR',
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    fontSize: '15px',
    '& div': {
      display: 'inline-table',
    },
  },
  addressLocation: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 300,
    fontSize: '15px',
  },
  list: {
    margin: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'row',
    padding: 0
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
      marginLeft: 15
    },
  },
  corp: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 300,
    marginTop: '15px',
    '& strong': {
      fontWeight: 900,
    },
  },
  right: {
    float: 'right',
    display: 'inline',
  },
}));

export default function Footer(): JSX.Element {

  const classes = styles();

  return (
    <Container>

      <div className={classes.root}>
        <Grid
          container
          direction="row-reverse"
          justify="space-between"
          alignItems="center"
          className={classes.iconsWrapper}
        >
          <Grid item>
            <ul className={classes.list}>
              <li>
                <Link
                  href="/이용약관"
                  color="inherit"
                  underline="none"
                  className={classes.listItem}
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/개인정보 처리방침"
                  color="inherit"
                  underline="none"
                  style={{ fontWeight: 'bold' }}
                  className={classes.listItem}
                >
                  개인정보 처리방침
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item className={classes.icons}>
            <a href="#" className={classes.icon}>
              <img src="./images/logo/truepointLogo.png" id="logo" alt="TruePointLogo" width={40} height={40} />
            </a>
            <Typography className={classes.name} variant="body2">
              TruePoint
            </Typography>
            <br />
          </Grid>
        </Grid>

        <Grid container>
          <Typography variant="caption" className={classes.addressLocation}>
            부산광역시 금정구 장전온천천로 51 테라스파크 3층 313-2호 트루포인트
          </Typography>
        </Grid>

        <Grid container>
          <Typography variant="caption" className={classes.addressTitle}>
            <div>
              대표명
              <span className={classes.address}>김규환</span>
            </div>
            <div>
              이메일
              <span className={classes.address}>truepointceo@gmail.com</span>
            </div>
            <div>
              사업자등록번호
              <span className={classes.address}>232-17-01389</span>
            </div>
            <div>
              통신판매업 신고번호
              <span className={classes.address}>번호 발급요함</span>
            </div>
            <div>
              개인정보보호책임자
              <span className={classes.address}>담당자 설정 요함</span>
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
            Truepoint Corp.
          </strong>
          {' All rights Reserved'}
        </Typography>
      </div>
    </Container>
  );
}