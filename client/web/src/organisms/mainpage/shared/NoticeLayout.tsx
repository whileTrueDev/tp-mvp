import {
  makeStyles, Theme, createStyles, Paper, Typography,
} from '@material-ui/core';
import React from 'react';
import shortid from 'shortid';
import { MYPAGE_MAIN_MAX_WIDTH } from '../../../assets/constants';
import createPostItStyles from '../../../utils/style/createPostitStyles';

export const useFontStyle = makeStyles((theme: Theme) => createStyles({
  title: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: 'bold',
    lineHeight: 2.5,
  },
  description: {
    fontSize: theme.typography.body1.fontSize,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

export const useContainerStyles = makeStyles((theme) => ({
  section: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: MYPAGE_MAIN_MAX_WIDTH,
    margin: `${theme.spacing(5)}px auto`,
    padding: theme.spacing(5),
    '&:before': createPostItStyles(theme, 'left top'),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 0.5),
    },
  },
  contents: { marginTop: theme.spacing(2) },
}));

export default function NoticeLayout({ children, title, description }: {
  children?: React.ReactNode,
  title?: string,
  description?: string | string[]
}): JSX.Element {
  const classes = useContainerStyles();
  const fontStyle = useFontStyle();
  return (
    <section className={classes.section}>
      <Paper elevation={0} className={classes.container}>
        <Typography className={fontStyle.title} variant="h6">{title}</Typography>

        {Array.isArray(description)
          ? description.map((desc, idx) => (
            <Typography key={shortid.generate()} className={fontStyle.description}>{desc}</Typography>
          ))
          : (
            <Typography className={fontStyle.description}>{description}</Typography>
          )}

        {children}
      </Paper>

    </section>
  );
}
