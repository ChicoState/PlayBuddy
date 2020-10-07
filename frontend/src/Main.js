import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';

const Main = () => (
  <Switch>
    <Route exact path="/">
      <Home/>
    </Route>
  </Switch>
);

export default Main;
