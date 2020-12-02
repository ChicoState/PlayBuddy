import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import ActivityPage from './pages/ActivityPage';
import ActivityListPage from './pages/ActivityListPage';

const Main = () => (
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/activityList">
      <ActivityListPage />
    </Route>
    <Route path="/activity">
      <ActivityPage id={420} />
    </Route>
  </Switch>
);

export default Main;
