import React from 'react';
import ReactDOM from 'react-dom'
import {
  ThemeProvider, Paper, Switch, Typography
} from '@material-ui/core';

import * as serviceWorker from './serviceWorker';

import theme from './theme'
import './assets/index.css';

function Index(): JSX.Element {
  
  const [isDarkTheme, setIsDarkTheme] = React.useState<boolean>(false);
  function handleTheme(): void {
    setIsDarkTheme(!isDarkTheme);
  }
  console.log(isDarkTheme ? 'dark' : 'light');

  return (
    <React.StrictMode>
      <ThemeProvider theme={isDarkTheme ? theme.darkTheme : theme.lightTheme}>
        <Paper>
          <Typography variant="h4">
            트루포인트
          </Typography>
          <Switch checked={isDarkTheme} onChange={handleTheme}></Switch>
        </Paper>
      </ThemeProvider>
    </React.StrictMode>
  );
}

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
