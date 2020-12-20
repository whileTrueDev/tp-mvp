import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import shortid from 'shortid';
import AgreementSource from './source/AgreementSource';
import AppBar from '../../organisms/shared/Appbar';
import useScrollTop from '../../utils/hooks/useScrollTop';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 70,
  },
  contentBox: {
    width: '80%',
    margin: '0px auto',
    wordBreak: 'keep-all',
  },
  header: {
    fontWeight: 300,
    fontSize: 50,
  },
  content: {
    marginTop: 20,
  },
  text: {
    marginTop: 30,
    fontSize: 20,
  },
  policyWrapper: {
    marginTop: theme.spacing(8),
  },
  h1: {
    letterSpacing: 0,
    fontSize: 50,
  },
  h2: {
    fontSize: 35,
  },
  h3: {

    fontSize: 25,
  },
  h4: {

    fontSize: 25,
  },
  h5: {

    fontSize: 24,

  },
  h6: {

    fontSize: 18,
  },
}));

interface Terms {
 title: string;
 text: string;

    }

export default function TermsOfUse(): JSX.Element {
  const classes = useStyles();
  useScrollTop();
  return (
    <div>
      <AppBar />
      <div className={classes.contentBox}>
        <div className={classes.root}>
          <Grid container direction="row" alignItems="center" justify="space-between">
            <Grid item>
              <h1 className={classes.h1}>이용 약관</h1>
            </Grid>
          </Grid>
          <Grid container>
            <div className={classes.root}>
              <div className={classes.content}>
                {AgreementSource.map((term: Terms) => (
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
