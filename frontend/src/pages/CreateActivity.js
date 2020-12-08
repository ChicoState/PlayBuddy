import React, { useState } from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import {
    Avatar,
    Button,
    Box,
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
    TextField,
    Typography,
} from '@material-ui/core';

const api_url = 'http://localhost:3001/api';

const CreateActivity = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [startDateE, setStartDateE] = useState('');
    const [endDateE, setEndDateE] = useState('');

    const onClear = () => {
        setTitle("");
        setDesc("");
        setStartDate("");
        setEndDate("");
        setStartDateE("");
    }

    const onSubmit = () => {
        let dateOne = new Date(startDate);
        let dateTwo = new Date(endDate);
        if (dateOne > dateTwo) {
            setStartDateE("Start Date must be before End Date, try again.");
            return;
        }
        console.log({ title, desc, startDate, endDate });
        let dict = {
            title,
            description: desc,
            startDateTime: startDate,
            endDateTime: endDate,
        };
        let loginRes;
        fetch(`${api_url}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({
                username: 'TheDude',
                password: 'WhiteRussian'
            })
        })
            .then((response) => response.json())
            .then(() => fetch(`${api_url}/activity/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(dict),
                credentials: 'same-origin',
            }).then((response) => response.json())
                .then(console.log)
                .catch(console.log)
            ).catch(console.log)
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h4">
                Welcome! Create your activity.
                </Typography>
            <Typography variant="subtitle1">
                Please create your activity with a title, brief description and a date.
                </Typography>
            <Box m="auto">
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
                    value={desc}
                    style={{ margin: 8 }}
                    onChange={(event) => setDesc(event.target.value)}
                />
            </Box>
            <Box m="auto">
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
            <Box m="auto">
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
        </Container>
    );
};

export default CreateActivity;