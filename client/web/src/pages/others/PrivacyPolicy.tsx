import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import shortid from 'shortid';
import terms from './source/terms';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 70,
  },
  contentBox: {
    width: '80%',
    margin: '0px auto',
    wordBreak: 'keep-all'
  },
  header: {
    fontWeight: 300,
    fontSize: 50,
  },
  content: {
    marginTop: 20,
    fontFamily: 'Noto Sans KR',
  },
  text: {
    marginTop: 30,
    fontSize: 20
  },
  policyWrapper: {
    marginTop: theme.spacing(8)
  },
  h1: {
    letterSpacing: 0,
    fontSize: 40,
  },
  h2: {
    fontSize: 35,
  },
  h3: {

    fontSize: 30,
  },
  h4: {
    fontSize: 20,
  },
  h5: {

    fontSize: 24,

  },
  h6: {

    fontSize: 18,
  },
}));

interface Term {
  title: string;
  text: string;
}

export default function PrivacyPolicy(): JSX.Element {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.contentBox}>
        <div className={classes.root}>
          <Grid container direction="row" alignItems="center" justify="space-between">
            <Grid item>
              <h1 className={classes.h1}>Policy</h1>
            </Grid>
          </Grid>
          <Grid container>
            <div className={classes.root}>
              <h2 className={classes.h2}>개인정보 처리방침</h2>
              <h4>{terms[3]}</h4>
              <div className={classes.content}>
                {terms[2].map((term: Term) => (
                  <div key={shortid.generate()} className={classes.policyWrapper}>
                    <h3 className={classes.h3} key={shortid.generate()}>{term.title}</h3>
                    <div key={shortid.generate()} className={classes.text}>
                      {term.text.split('\n').map((sentence) => (
                        <p key={shortid.generate()}>{sentence}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Grid>
        </div>
      </div>
    </div>
  );
}
