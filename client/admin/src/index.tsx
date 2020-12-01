import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createBrowserHistory } from 'history';
import { Router, Route } from 'react-router-dom';
import { configure } from 'axios-hooks';
import { SnackbarProvider } from 'notistack';
import App from './App';
import axios from './util/axios';

const history = createBrowserHistory();
configure({ axios });

function Index(): JSX.Element {
  return (
    <SnackbarProvider
      maxSnack={1}
      preventDuplicate
    >
      <Router history={history}>
        <Route path="/" component={App} />
      </Router>
    </SnackbarProvider>
  );
}

ReactDOM.render(
  <Index />,
  document.getElementById('root'),
);
