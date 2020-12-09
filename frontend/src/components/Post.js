import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Link,
  Typography,
} from '@material-ui/core';
import {
  Favorite as FavoriteIcon,
  MoreVert as MoreVertIcon,
  Share as ShareIcon,
} from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 16,
    marginBottom: 16,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    maxHeight: 500,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

const ActivitiesPost = ({
  title,
  date,
  id,
  image,
  desc,
  author,
}) => {
  const classes = useStyles();

  const localDate = new Date(date);
  let subtitle = localDate.toLocaleDateString();
  let name = '';

  if (author) {
    if (author.fullname && author.fullname.firstName && author.fullname.lastName) {
      name = `${author.fullname.firstName} ${author.fullname.lastName}`;
    } else {
      name = author.username;
    }
    subtitle = `By ${name} starting on ${subtitle}`;
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={(
          <Avatar aria-label="author">
            R
          </Avatar>
        )}
        action={(
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        )}
        title={(
          <Link
            component={RouterLink}
            to={`/activity/${id}`}
            variant="h6"
            color="textPrimary"
          >
            {title}
          </Link>
        )}
        subheader={subtitle}
      />
      { image && (
      <CardMedia
        className={classes.media}
        image={image.url}
        title={image.title}
      />
      )}
      {desc && (
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {desc}
          </Typography>
        </CardContent>
      )}
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

ActivitiesPost.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  image: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string,
  }),
  desc: PropTypes.string,
  author: PropTypes.shape({
    username: PropTypes.string.isRequired,
    fullname: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }),
};

ActivitiesPost.defaultProps = {
  image: undefined,
  desc: undefined,
  author: undefined,
};

export default ActivitiesPost;
