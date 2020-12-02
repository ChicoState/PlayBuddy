import React, { useState } from 'react';
import { withStyles } from '@material-ui/styles'; 
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';

const api_url = 'http://localhost:3001/api';

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

const styles = () => ({
  Card: {
    marginTop: 12,
    marginBottom: 12,
  },
});

class ActivityPage extends React.Component {
  // Constructor
  constructor(props) {
    super(props);
    this.state = {
      activityData: null,
      loadingData: {
        finished: false,
        error: false,
      },
      commentData: fakeCommentData,
      id: props.id,
      authorData: null,
      classes: this.props.classes, 
    }
  }

  componentDidMount() {
    fetch(`${api_url}/activity/${this.state.id}`, {
      //mode: 'same-origin',
    })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(
        (result) => {
          console.log(result)
          this.setState({
            activityData: result.activity,
            loadingData: {finished: true},
            authorData: result.author,
          });
        },
        (error) => {
          console.log(error);
          this.setState({
            loadingData: {
              finished: false,
              error
            }
          });
        }
      )
  }

  render() {
    const {
      activityData,
      commentData,
      loadingData,
      authorData: author,
      classes,
    }=this.state;
    if (loadingData.error) {
      return <div> Error</div>;
    }
    else if(!loadingData.finished) {
      return <CircularProgress/>;
    }
    else {
      let usersfullName = '';
      if(author.fullname && author.fullname.firstName && author.fullname.lastName) {
        usersfullName = `${author.fullname.firstName} ${author.fullname.lastName}`;
      }
      return (
      <Container>
        <Card className={classes.Card}>
          <CardHeader
            avatar={(
              <Avatar
                //these postedBy's need to be changed
                alt={`${author.username}'s profile picture`}
                src={author.image}
              >
                {author.username ? author.username[0] : ''}
              </Avatar>
            )}
            title={author.username}
            subheader={usersfullName}
          >
          </CardHeader>
          <CardContent>
            <Typography variant="h3" color="textSecondary">
              {activityData.title}
          </Typography>
            <Typography variant="body2" color="textSecondary">
              {activityData.description}
          </Typography>
          </CardContent>
        </Card>
        <Paper>
          <List>
            {commentData.map((comment) => (
              <ListItem key={comment.postedBy}>
                <ListItemAvatar>
                  <Avatar
                    alt={`${comment.postedBy}'s profile picture`}
                    src={comment.postedBy}
                  >
                    {comment.postedBy}
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
    }
    
  }

};

ActivityPage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default withStyles(styles)(ActivityPage);