import React from 'react';
import {
  AppBar,
  IconButton,
  Link,
  makeStyles,
  Toolbar,
} from '@material-ui/core';
import { AccountCircle, Menu } from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    color: 'white',
    fontWeight: 'bold',
  },
}));

const Header = () => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Link
          component={RouterLink}
          to="/"
          variant="h5"
          className={classes.title}
          underline="none"
        >
          PlayBuddy
        </Link>
        <IconButton>
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
