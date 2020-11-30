import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import FilterIcon from '@material-ui/icons/FilterList';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import Post from '../components/Post';
import useCurrentLocation from '../utils/useCurrentLocation';

const styles = (theme) => ({
  margin: {
    margin: theme.spacing.unit,
  },
  containerStyle: {
    marginTop: 30,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(2),
    width: '75%',
  },
});

const ActivityList = (props) => {
  const { classes } = props;
  const [activities, setActivities] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const { location, error } = useCurrentLocation();
  const [applyFilter, setApplyFilter] = useState({});
  const closeDialog = () => setOpenFilterDialog(false);
  const openDialog = () => setOpenFilterDialog(true);

  const handleFilterInput = (field, val) => {
    const tmpFilter = { ...filterCriteria };
    tmpFilter[field] = val;
    setFilterCriteria(tmpFilter);
  };

  const getFilterVal = (field) => filterCriteria[field] ?? null;

  const handleApplyFilter = () => {
    setApplyFilter({ ...filterCriteria });
    closeDialog();
  };

  const handleResetFilter = () => {
    setApplyFilter({});
    setFilterCriteria({});
    closeDialog();
  };

  const tmpActivities = activities?.filter((tmp) => tmp?.activity?.title?.includes(searchText) || tmp?.activity?.description?.includes(searchText));

  useEffect(() => {
    async function fetchActivities() {
      // setLoading(true);
      const result = await fetch('http://localhost:3001/api/activity/search', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location, filters: applyFilter }),
      });
      const resJson = await result.json();
      setActivities(resJson?.results);
      // setLoading(false);
    }
    fetchActivities();
  }, [location, applyFilter]);

  return (
    <Container>
      <Dialog open={openFilterDialog} onClose={closeDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Filter</DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item xs={6}>
              <KeyboardDateTimePicker
                variant="inline"
                ampm={false}
                label="Start Date"
                value={getFilterVal('startDate')}
                onChange={(val) => { handleFilterInput('startDate', val?.toDate()?.getTime()); }}
                onError={console.log}
                format="yyyy/MM/DD HH:mm"
                className={classes.margin}
              />
            </Grid>
            <Grid item xs={6}>
              <KeyboardDateTimePicker
                variant="inline"
                ampm={false}
                label="End Date"
                value={getFilterVal('endDate')}
                onChange={(val) => { handleFilterInput('endDate', val?.toDate()?.getTime()); }}
                onError={console.log}
                format="yyyy/MM/DD HH:mm"
                className={classes.margin}
              />
            </Grid>

          </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetFilter} color="secondary">
            Reset
          </Button>
          <Button onClick={handleApplyFilter} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
      {
        loading ? <CircularProgress />
          : (

            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              className={classes.containerStyle}
            >
              <Grid item xs={7}>
                <h1>Activities</h1>
              </Grid>
              <Grid item xs={5}>
                <TextField id="outlined-search" label="Search Activity" value={searchText} type="search" variant="outlined" className={classes.textField} onChange={(evt) => setSearchText(evt.target.value)} />
                <IconButton className={classes.margin} variant="primary" onClick={openDialog}>
                  <FilterIcon />
                </IconButton>
              </Grid>
              {
          tmpActivities.map((tmp) => (
            <Grid item xs={4} key={tmp.activity._id}>
              <Post
                title={tmp.activity.title}
                desc={tmp.activity.description}
                date={tmp.activity.startDateTime}
                image={{
                  url: 'http://delaveagadiscgolf.com/wp-content/uploads/2011/07/15_Tee.jpg',
                  title: 'This is a photo of a spot on the course.',
                }}
              />
            </Grid>
          ))
}

            </Grid>
          )
}
    </Container>
  );
};

export default withStyles(styles)(ActivityList);
