import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import ActivityPage from './pages/ActivityPage';

const Main = () => (
  <Switch>
    <Route exact path="/">
      <Home/>
    </Route>
    <Route 
      path="/activity/:id"
      children={({match}) => (<ActivityPage id={match.params.id}/>)}
    />
  </Switch>
);

export default Main;
