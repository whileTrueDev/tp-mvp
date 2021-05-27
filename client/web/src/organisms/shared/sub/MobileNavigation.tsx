import React from 'react';
import { Hidden, Button } from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles((theme: Theme) => createStyles({
  mobileNavContainer: {
    padding: theme.spacing(0.5, 1.5),
    backgroundColor: theme.palette.grey[200],
  },
  button: {
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.action.disabled,
    color: theme.palette.primary.contrastText,
    '&.active': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

type Nav = {
  label: string;
  path: string;

}
const mobileNav: Nav[] = [
  { label: '인방랭킹', path: '/ranking' },
  { label: '방송인검색', path: '/ranking/search' },
  { label: '자유게시판', path: '/community-board' },
];

function MatchButton(props: Nav): JSX.Element {
  const classes = useStyles();
  const { label, path } = props;
  const match = useRouteMatch({
    path,
    exact: true,
    strict: true,
  });

  return (
    <Button
      className={classnames(classes.button, { active: match && match.isExact })}
      size="small"
      variant="contained"
      key={path}
      component={RouterLink}
      to={path}
    >
      {label}
    </Button>
  );
}

export default function MobileNavigation(): JSX.Element {
  const classes = useStyles();
  return (
    <Hidden smUp>
      <div className={classes.mobileNavContainer}>
        {mobileNav.map((nav) => (
          <MatchButton label={nav.label} path={nav.path} />
        ))}
      </div>
    </Hidden>
  );
}
