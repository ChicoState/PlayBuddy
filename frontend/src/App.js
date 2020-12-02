import React from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Main from './Main';
import Header from './Header';

function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <>
        <Header />
        <Main />
      </>
    </MuiPickersUtilsProvider>
  );
}

export default App;
