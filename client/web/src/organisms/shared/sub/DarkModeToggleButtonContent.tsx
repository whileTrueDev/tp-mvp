import React from 'react';
import {
  Brightness4 as DarkThemeIcon,
  Brightness7 as LightThemeIcon,
} from '@material-ui/icons';
import { useStyles } from '../styles/Appbar.style';

export default function DarkModeToggleButtonContent(): JSX.Element {
  const classes = useStyles();
  return (
    <>
      <LightThemeIcon className={classes.lightModeIcon} />
      <DarkThemeIcon className={classes.darkModeIcon} />
    </>
  );
}
