import React from 'react';
import { Switch, Route } from 'react-router-dom';

const Main = () => (
  <Switch>
    <Route exact path="/">
      <h1>This is the Main Page</h1>
    </Route>
  </Switch>
);

export default Main;
