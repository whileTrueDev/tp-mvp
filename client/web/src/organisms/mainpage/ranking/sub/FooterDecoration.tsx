import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyle = makeStyles((theme: Theme) => createStyles({
  footerImages: {
    width: '100%',
    height: theme.spacing(64),
    backgroundImage: 'url(/images/rankingPage/footer_bg.svg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
}));
export default function FooterDecoration(): JSX.Element {
  const classes = useStyle();
  return (
    <div className={classes.footerImages} />

  );
}
