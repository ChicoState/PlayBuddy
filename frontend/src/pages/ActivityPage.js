import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import {
  Avatar,
  CardContent,
  CardHeader,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  Button
} from '@material-ui/core';

const fakeActivityData = {
  title: 'Muay Thai Session',
  location: 'My Garage',
  desc: 'A fun light paced one hour intro to muay thai.',
  author: {
    username: 'Jay',
    fullname: 'Jay Gohner',
    userId: 420,
    avatarURL: 'https://bullmuaythaikrabi.com/wp-content/uploads/2017/09/Bull-Muay-Thai-Krabi-fighters-news_6.jpg'
  },
};

const fakeCommentData = [
  {
    comment: 'This will be an hour long introductory course.',
    author: {
      username: 'Jay',
      fullname: 'Jay Gohner',
      userId: 420,
      avatarURL: 'https://bullmuaythaikrabi.com/wp-content/uploads/2017/09/Bull-Muay-Thai-Krabi-fighters-news_6.jpg'
    },
  },
];

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(2),
    width: '90%',
  },
}));

const ActivityPage = ({ id }) => {
  // this gets and sets state for activity data, comes from post id
  const [activityData, setActivityData] = useState(fakeActivityData);
  // this gets and sets loading
  const [loading, setLoading] = useState({
    running: false,
    finished: false,
    error: false
  });
  // this gets and sets the comment data
  const [comments, setComments] = useState(fakeCommentData);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const classes = useStyles();
  const filter = async () => {
    let sendData = {
      omitEnded: endDate,
      omitStarted: startDate
    }
    console.log(sendData);
    let apiUrl = "http://127.0.0.1:4000/api/activity/filter"
    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://127.0.0.1:4000",
      },
      body: JSON.stringify(sendData)
    };

    await fetch(apiUrl, options)
    .then((res) => res.json())
    .then(
      (result) => {
        console.log('result', result);
        return result;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  return (
    <Container>
      <Card style={{paddingTop: 20, paddingBottom: 20, marginTop: 10}}>
        <form className={classes.container} noValidate >
          <TextField
            id="datetime-local"
            label="Start Date Time"
            type="datetime-local"
            defaultValue="2017-05-24T10:30"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(val) => {
              setStartDate(val.target.value);
              console.log('val', val.target.value);
            }}
          />
          <br />
          <TextField
            id="datetime-local"
            label="End Date Time"
            type="datetime-local"
            defaultValue="2017-05-24T10:30"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(val) => {
              setEndDate(val.target.value);
              console.log('val', val.target.value);
            }}
          />

          <Button variant="contained" color="primary" style={{alignSelf: "center"}} onClick={()=>filter()}>
            Filter
          </Button>
        </form>
      </Card>
      <br />
      <Card>
        <CardHeader>
          {id}
        </CardHeader>
        <CardHeader
          avatar={(
            <Avatar
              alt={`${activityData.author.username}'s profile picture`}
              src={activityData.author.avatarURL}
            >
              {activityData.author.username}
            </Avatar>
          )}
          title={activityData.author.fullname}
          subheader={activityData.author.username}
        >
        </CardHeader>
        <CardContent>
          <Typography variant="h3" color="textSecondary">
            Location
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Desc
          </Typography>
        </CardContent>
      </Card>
      <Paper>
        <List>
          {comments.map((comment) => (
            <ListItem key={comment.author.username}>
              <ListItemAvatar>
                <Avatar
                  alt={`${comment.author.username}'s profile picture`}
                  src={comment.author.avatarURL}
                >
                  {comment.author.fullname}
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                {comment.comment}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>

  );

};

ActivityPage.propTypes = {
  id: PropTypes.number.isRequired,
};

export default ActivityPage;
