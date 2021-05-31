import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyle = makeStyles((theme: Theme) => createStyles({
  footerImages: {
    width: '100%',
    height: theme.spacing(25),
    backgroundImage: 'url(/images/rankingPage/footer_bg.svg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '80%',
    backgroundPosition: 'center top',
  },
}));
export default function FooterDecoration(): JSX.Element {
  const classes = useStyle();
  return (
    <div className={classes.footerImages} />

  );
}
