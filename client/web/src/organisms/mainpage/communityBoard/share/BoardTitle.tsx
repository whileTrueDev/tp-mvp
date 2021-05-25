import React from 'react';
import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => {
  const defaultIconBackgroundSize = theme.spacing(7);
  return createStyles({
    title: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      '&>*': {
        marginRight: theme.spacing(1),
      },
      padding: theme.spacing(2, 0),
    },
    platformLogo: {
      width: '100%',
      maxWidth: '50px',
      minHeight: '100%',
    },
    titleText: {
      zIndex: 1,
      whiteSpace: 'pre-line',
    },
    subTitleText: {
      fontSize: theme.typography.subtitle2.fontSize,
    },
    bg: {
      position: 'absolute',
      left: defaultIconBackgroundSize * (-0.5),
      top: 0,
      width: defaultIconBackgroundSize,
      height: defaultIconBackgroundSize,
      backgroundSize: `${defaultIconBackgroundSize}px ${defaultIconBackgroundSize}px`,
      opacity: 0.3,
    },
  });
});

export const PLATFORM_NAMES = {
  afreeca: '아프리카',
  twitch: '트위치',
  free: '자유',
};
export interface BoardTitleProps {
  platform: 'afreeca'|'twitch'|'free';
  boardType?: boolean;
  imageSrc?: string;
  title?: string;
  subTitle?: string;
}
export default function BoardTitle({
  platform, boardType, imageSrc, title, subTitle,
}: BoardTitleProps): JSX.Element {
  const classes = useStyles();
  if (!platform) {
    return (
      <Typography variant="h4" className={classes.titleText}>게시판</Typography>
    );
  }
  return (
    <div className={classes.title}>
      {boardType ? (
        <>
          <img
            className={classes.platformLogo}
            src={`/images/logo/${platform}Logo.png`}
            alt={`${platform}Logo`}
          />
          <Typography variant="h4" className={classes.titleText}>
            {`${PLATFORM_NAMES[platform]}
          ${boardType ? '방송인' : '게시판'}`}
          </Typography>
        </>
      ) : (
        <>
          {imageSrc && <div className={classes.bg} style={{ backgroundImage: `url(${imageSrc})` }} />}
          <Typography variant="h4" className={classes.titleText}>
            {title}
          </Typography>
          <Typography variant="subtitle1" className={classes.subTitleText}>
            {subTitle}
          </Typography>
        </>
      )}

    </div>
  );
}
