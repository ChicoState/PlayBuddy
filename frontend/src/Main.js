import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import ActivityPage from './pages/ActivityPage';

const Main = () => (
  <Switch>
    <Route exact path="/">
      <Home/>
    </Route>
    <Route path="/activity">
      <ActivityPage id={420}/>
    </Route>
  </Switch>
);

export default Main;
