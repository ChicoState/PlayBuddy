/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Fab,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  Add as AddIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import Post from '../components/Post';

const apiUrl = 'http://localhost:3001/api';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState('');

  const classes = useStyles();

  // The set of activities from /search
  const [results, setResults] = useState([]);

  // Function called only once on mount
  useEffect(() => {
    fetch(`${apiUrl}/activity/search`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results);
        setLoading(false);
      })
      .catch((error) => {
        setLoadingError(error);
        setLoading(false);
      });
  }, []);

  const ErrorState = () => (
    <Typography>Sorry, something went wrong. Try again in a few moments.</Typography>
  );

  const LoadingState = () => (
    <Box m="auto">
      <Typography>Loading latest activities, hang tight!</Typography>
      <CircularProgress />
    </Box>
  );

  const DisplayState = () => results.map((item) => (
    <Post
      key={`result-${item.activity._id}`}
      title={item.activity.title}
      desc={item.activity.description}
      id={item.activity._id}
      date={item.activity.startDateTime}
      author={item.author}
    />
  ));

  let CurrentState;

  if (loadingError) {
    CurrentState = ErrorState;
  } else if (loading) {
    CurrentState = LoadingState;
  } else {
    CurrentState = DisplayState;
  }

  return (
    <Container style={{ marginTop: 16, marginBottom: 16 }}>
      <Typography variant="h3">Recent Activities</Typography>
      <CurrentState />
      <Fab
        color="primary"
        aria-label="new activity"
        className={classes.fab}
        variant="extended"
        component={Link}
        to="/create"
      >
        <AddIcon className={classes.extendedIcon} />
        Create
      </Fab>
    </Container>
  );
};

export default Home;
