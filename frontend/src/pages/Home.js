import React from 'react';
import Container from '@material-ui/core/Container';
import Post from '../components/Post';

const OurHome = () => (
  <Container>
    <h1>This is the Home Page</h1>
    <Post
      title="Disc Golf at DeLaveaga"
      date="04/20/2021"
      image={{
        url: 'http://delaveagadiscgolf.com/wp-content/uploads/2011/07/15_Tee.jpg',
        title: 'This is a photo of a spot on the course.',
      }}
      desc="Come down to Delaveaga for a great game of Disc Golf."
    />
    <Post
      title="Muay Thai Session"
      date="06/02/2021"
      image={{
        url: 'https://classpass-res.cloudinary.com/image/upload/f_auto,q_auto/a3pr36op4izqmtazy31g.png',
        title: 'This is a photo of a muay thai session.',
      }}
      desc="Come by for an hour Muay Thai session!"
    />
    <Post
      title="2 Man Pickup"
      date="06/15/2021"
      image={{
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSoDUsrjS1YMSMz8mkrrZkp1j7YjvMhUsPscg&usqp=CAU',
      }}
      desc="A classic 2-man pickup game."
    />
    <Post
      title="Kettlebell Run"
      date="05/08/2021"
    />
  </Container>
);

export default OurHome;
