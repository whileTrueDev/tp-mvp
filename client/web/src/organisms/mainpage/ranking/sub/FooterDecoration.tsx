import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyle = makeStyles((theme: Theme) => createStyles({
  headerImages: {
    position: 'relative',
    width: '100%',
    height: theme.spacing(60),
    '& .bg-img': {
      position: 'absolute',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
    },
    '& .zigzag-square': {
      top: theme.spacing(3),
      right: theme.spacing(4),
      width: '14%',
      minHeight: '286px',
      backgroundImage: 'url(images/rankingPage/zigzag-square.svg)',
    },
    '& .people': {
      left: theme.spacing(3),
      bottom: 0,
      width: '34%',
      minHeight: '219px',
      backgroundImage: 'url(images/rankingPage/people.svg)',
    },
  },
}));
export default function FooterDecoration(): JSX.Element {
  const classes = useStyle();
  return (
    <>
      <div className={classes.headerImages}>
        <div className="bg-img people" />
        <div className="bg-img zigzag-square" />
      </div>
    </>

  );
}
