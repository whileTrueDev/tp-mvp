import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createBrowserHistory } from 'history';
import { Router, Route } from 'react-router-dom';
import { configure } from 'axios-hooks';
import App from './App';
import axios from './util/axios';

const history = createBrowserHistory();
configure({ axios });

ReactDOM.render(

  <Router history={history}>
    <Route path="/" component={App} />
  </Router>,

  document.getElementById('root'),
);
