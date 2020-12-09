import React, { useState } from 'react';
import {
  Button,
  Box,
  Container,
  TextField,
  Typography,
} from '@material-ui/core';

const apiUrl = 'http://localhost:3001/api';

const CreateActivity = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [startDateE, setStartDateE] = useState('');
  const [endDateE] = useState('');

  const onClear = () => {
    setTitle('');
    setDesc('');
    setStartDate('');
    setEndDate('');
    setStartDateE('');
  };

  const onSubmit = () => {
    const dateOne = new Date(startDate);
    const dateTwo = new Date(endDate);
    if (dateOne > dateTwo) {
      setStartDateE('Start Date must be before End Date, try again.');
      return;
    }
    console.log({
      title, desc, startDate, endDate,
    });
    const dict = {
      title,
      description: desc,
      startDateTime: startDate,
      endDateTime: endDate,
    };
    fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'TheDude',
        password: 'WhiteRussian',
      }),
    })
      .then((response) => response.json())
      .then(() => fetch(`${apiUrl}/activity/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dict),
        credentials: 'same-origin',
      }).then((response) => response.json())
        .then(console.log)
        .catch(console.log)).catch(console.log);
  };

  return (
    <Container maxWidth="sm">
      <Box my={2}>
        <Typography variant="h4">
          Create an Activity
        </Typography>
        <Typography variant="subtitle1">
          Please create your activity with a title, brief description and a date.
        </Typography>
        <Box mx="auto">
          <TextField
            label="Activity Title"
            variant="filled"
            value={title}
            style={{ margin: 8 }}
            onChange={(event) => setTitle(event.target.value)}
          />
          <TextField
            label="Activity Description"
            variant="filled"
            multiline
            value={desc}
            style={{ margin: 8 }}
            onChange={(event) => setDesc(event.target.value)}
          />
        </Box>
        <Box mx="auto">
          <TextField
            label="Start Day"
            type="date"
            value={startDate}
            style={{ margin: 8 }}
            error={Boolean(startDateE)}
            helperText={startDateE}
            onChange={(event) => setStartDate(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Day"
            type="date"
            value={endDate}
            error={Boolean(endDateE)}
            helperText={endDateE}
            style={{ margin: 8 }}
            onChange={(event) => setEndDate(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box mx="auto">
          <Button
            variant="contained"
            color="secondary"
            style={{ margin: 8 }}
            onClick={onClear}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: 8 }}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateActivity;
