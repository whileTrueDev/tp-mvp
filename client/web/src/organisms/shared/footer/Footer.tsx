import React from 'react';
import {
  Button, Container, Grid, Typography, Hidden,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import TruepointLogo from '../../../atoms/TruepointLogo';
import { RANKING_PAGE_CONTAINER_WIDTH } from '../../../assets/constants';

const styles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    maxWidth: RANKING_PAGE_CONTAINER_WIDTH,
    padding: theme.spacing(2, 0),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    width: 220 / 2,
    height: 80 / 2,
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
    marginLeft: theme.spacing(1),
    textDecoration: 'none',
    color: theme.palette.text.primary,
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

  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Hidden smDown>
            <Grid item sm={2} xs={12} className={classes.icons}>
              <TruepointLogo width={220 / 2} height={80 / 2} />
              <br />
            </Grid>
          </Hidden>

          <Grid item sm={10} xs={12} container direction="column">
            <Grid item container justify="space-between" alignItems="center">
              <div>
                <Hidden smDown>
                  <Typography component="span" variant="body2">
                    이메일
                  </Typography>
                </Hidden>

                <Typography component="a" variant="body2" href="truepointceo@gmail.com" className={classes.address}>
                  truepointceo@gmail.com
                </Typography>
              </div>
              <ul className={classes.list}>
                <li>
                  <Button component={Link} to="/termsofuse">이용약관</Button>
                </li>
                <li>
                  <Button component={Link} to="/privacypolicy" style={{ fontWeight: 'bold' }}>개인정보 처리방침</Button>
                </li>
              </ul>
            </Grid>
            <Grid item>
              <Typography variant="caption" className={classes.corp}>
                <strong>
                  &copy;
                  WhileTrue Corp.
                </strong>
                {' All rights Reserved'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* 제거요청 2021.05.31 from robert */}
        {/* <Grid container>
          <Typography variant="caption" className={classes.addressLocation}>
            부산광역시 금정구 장전온천천로 51 테라스파크 3층 313호
          </Typography>
        </Grid> */}

        {/* <Grid container> */}
        {/* <Typography variant="caption" className={classes.addressTitle}> */}
        {/* 제거 요청 2020. 11. 27 from walker */}
        {/* <div>
              대표명
              <span className={classes.address}>강동기</span>
            </div> */}
        {/* <div>
              사업자등록번호
              <span className={classes.address}>659-03-01549</span>
            </div>
            <div>
              통신판매업 신고번호
              <span className={classes.address}>제2019-부산금정-0581호</span>
            </div> */}

        {/* 제거요청 2021.05.31 from robert */}
        {/* <div>
              개인정보보호책임자
              <span className={classes.address}>강태섭</span>
            </div>
            <div>
              고객센터
              <span className={classes.address}>051-515-6309</span>
            </div> */}
        {/* </Typography> */}
        {/* </Grid> */}

      </Container>
    </div>
  );
}
