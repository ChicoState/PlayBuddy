import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import ActivityPage from './pages/ActivityPage';
import CreateActivity from './pages/CreateActivity';

const Main = () => (
  <Switch>
    <Route exact path="/">
      <Home/>
    </Route>
    <Route 
      path="/activity/:id"
      children={({match}) => (<ActivityPage id={match.params.id}/>)}
    />
    <Route path="/create">
      <CreateActivity/>
    </Route>
  </Switch>
);

export default Main;
