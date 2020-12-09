import React from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';

const apiUrl = 'http://localhost:3001/api';

const styles = () => ({
  Card: {
    marginTop: 12,
    marginBottom: 12,
  },
});

class ActivityPage extends React.Component {
  // Constructor
  constructor(props) {
    super();
    this.state = {
      activityData: null,
      loadingData: {
        finished: false,
        error: false,
      },
      id: props.id,
      authorData: null,
    };
  }

  componentDidMount() {
    const { id } = this.state;
    fetch(`${apiUrl}/activity/${id}`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            activityData: result.activity,
            loadingData: { finished: true },
            authorData: result.author,
          });
        },
        (error) => {
          this.setState({
            loadingData: {
              finished: false,
              error,
            },
          });
        },
      )
      .catch((error) => {
        this.setState({
          loadingData: {
            finished: false,
            error,
          },
        });
      });
  }

  render() {
    const {
      activityData,
      loadingData,
      authorData: author,
    } = this.state;

    // Check if there was an error getting data
    if (loadingData.error) {
      return <div>Error</div>;
    }
    // Check if we're not done loading
    if (!loadingData.finished) {
      return <CircularProgress />;
    }

    // Create a string with the user's full name
    let usersFullName = '';
    if (author.fullname && author.fullname.firstName && author.fullname.lastName) {
      usersFullName = `${author.fullname.firstName} ${author.fullname.lastName}`;
    }

    // Format date range string for event length
    let startDate;
    let endDate;
    let dateRange;
    if (activityData.startDateTime) {
      startDate = (new Date(activityData.startDateTime)).toLocaleDateString();
      dateRange = startDate;
      if (activityData.endDateTime) {
        endDate = (new Date(activityData.endDateTime)).toLocaleDateString();
        dateRange = `${startDate} - ${endDate}`;
      }
    }

    return (
      <Container>
        <Paper>
          <Box my={2} p={2}>
            <Box mb={1}>
              <Box display="flex" flexWrap="wrap" style={{ alignItems: 'flex-end' }}>
                <Typography variant="h3" style={{ marginRight: 8 }}>
                  {activityData.title}
                </Typography>
                <Typography>
                  By
                  {' '}
                  {usersFullName || author.username}
                </Typography>
              </Box>
              {dateRange && (
                <Typography variant="body1">{dateRange}</Typography>
              )}
            </Box>
            <Box my={2} mx={2}>
              <Typography variant="body2">
                {activityData.description}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper>
          <Container>
            <Box py={2}>
              <Box mb={1}>
                <Typography variant="h4">Comments</Typography>
              </Box>
              <Divider />
              <List>
                {
                  // Check if there are comments
                  activityData.comments.length > 0
                    ? activityData.comments.map((comment) => (
                      <ListItem key={comment.id}>
                        <ListItemAvatar>
                          <Avatar
                            alt={`${comment.author.username}'s profile picture`}
                          >
                            {comment.author.username}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                          {comment.comment}
                        </ListItemText>
                      </ListItem>
                    ))
                    : (
                      <Box>
                        <Typography>
                          It&apos;s quiet around here... Check back later.
                        </Typography>
                      </Box>
                    )
                }
              </List>
            </Box>
          </Container>
        </Paper>
      </Container>

    );
  }
}

ActivityPage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default withStyles(styles)(ActivityPage);
