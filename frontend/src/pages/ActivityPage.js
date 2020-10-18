import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
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

  return (
    <Container>
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