const express = require('express');
const Activity = require('../../database/models/activity');
const User = require('../../database/models/user');
const ZipCode = require('../../database/models/zipCode');

const activity = express.Router();

/**
 * Finds a User by ID and returns a formatted object, removing sensitive info
 * @param {String | ObjectID} id - The id of the User
 */
async function getUserDataById(id) {
  try {
    const user = await User.findById(id).exec();
    return {
      username: user.username,
      fullname: user.fullname,
      // eslint-disable-next-line no-underscore-dangle
      _id: user._id,
    };
  } catch (error) {
    console.log(`Unable to fetch User from database with id: ${id}`);
    return {};
  }
}

/**
 * Creates a new activity and returns its data
 * @param {Hex} id - The id of the activity, must be only hexadecimal
 * @body {String} title - The title of the post
 * @body {String} description - The title of the post
 * @body {Integer} startDateTime - The date/time the activity will start in milliseconds
 * @body {Integer} endDateTime - The date/time the activity will end in milliseconds
 * @body {Integer} zipCode - The zip code of the activity, used for approximate distance checks
 */
activity.route('/create')
  .post(async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Not authenticated',
      });
    }
    
    // Create the activity
    const currentDateTime = Date.now();
    const activitydata = new Activity({
      title: req.body.title || 'Unnamed activity',
      description: req.body.description || 'No description offered',
      creationDateTime: currentDateTime,
      lastEditDateTime: currentDateTime,
      zipCode: req.body.zipCode || -1,
      startDateTime: req.body.startDateTime || (currentDateTime + 86400000),
      endDateTime: req.body.endDateTime || (currentDateTime + 90000000),
      postedBy: req.user.id,
    });

    // Ensure end time comes after start time
    if (activitydata.endDateTime < activitydata.startDateTime) {
      return res.status(400).json({
        error: 'endDateTime is less than startDateTime',
      });
    }

    // Save it to the database
    try {
      await activitydata.save();
    } catch (error) {
      return res.status(500).json({
        error: 'Error saving to database',
      });
    }

    // Response
    return res.status(200).json({
      activity: activitydata,
      author: {
        username: req.user.username,
        fullname: req.user.fullname,
        _id: req.user.id,
      },
    });
  });

/**
 * Edits activity by id
 * TODO: Implement this
 * @param {Hex} id - The id of the activity, must be only hex digits
 */
activity.route('/edit/:id([a-f0-9]+)')
  .post(async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Not authenticated',
      });
    }

    // Get the activity to edit
    let getobj;
    try {
      getobj = await Activity.findById(req.params.id).exec();
    } catch (error) {
      return res.status(500).json({
        error: 'Error retrieving from database',
      });
    }

    // Ensure an actual object was found
    if (!getobj) {
      return res.status(404).json({
        error: 'Not found',
      });
    }

    // Ensure the authenticated user is author of this activity
    if (getobj.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        error: 'Wrong account',
      });
    }

    // Change the activity data
    const shortened = Boolean(req.query.shortened);
    const currentDateTime = Date.now();
    getobj.title = req.body.title || getobj.title;
    getobj.description = req.body.description || getobj.description;
    getobj.startDateTime = req.body.startDateTime || getobj.startDateTime;
    getobj.endDateTime = req.body.endDateTime || getobj.endDateTime;
    getobj.lastEditDateTime = currentDateTime;
    getobj.zipCode = req.body.zipCode;

    // Ensure end time comes after start time
    if (getobj.endDateTime < getobj.startDateTime) {
      return res.status(400).json({
        error: 'endDateTime is less than startDateTime',
      });
    }

    // Save it to the database
    try {
      await getobj.save();
    } catch (error) {
      return res.status(500).json({
        error: 'Error saving to database',
      });
    }

    // Response
    return res.status(200).json({
      activity: getobj,
      author: {
        username: req.user.username,
        fullname: req.user.fullname,
        _id: req.user.id,
      },
      shortened,
    });
  });

/**
 * Deletes an activity by id
 * @param {Hex} id - The id of the activity, must be only hexadecimal
 */
activity.route('/delete/:id([a-f0-9]+)')
  .post(async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Not authenticated',
      });
    }

    // Get the activity to delete
    let getobj;
    try {
      getobj = await Activity.findById(req.params.id).exec();
    } catch (error) {
      return res.status(500).json({
        error: 'Error retrieving from database',
      });
    }

    // Ensure an actual object was found
    if (!getobj) {
      return res.status(404).json({
        error: 'Not found',
      });
    }

    // Ensure the authenticated user is author of this activity
    if (getobj.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        error: 'Wrong account',
      });
    }

    // Mark it as deleted
    getobj.deleted = 1;

    // Save it to the database
    try {
      await getobj.save();
    } catch (error) {
      return res.status(500).json({
        error: 'Error saving to database',
      });
    }

    // Response
    return res.sendStatus(200);
  });

/**
 * Restores an activity by id
 * @param {Hex} id - The id of the activity, must be only hexadecimal
 */
activity.route('/restore/:id([a-f0-9]+)')
  .post(async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Not authenticated',
      });
    }

    // Get the activity to restore
    let getobj;
    try {
      getobj = await Activity.findById(req.params.id).exec();
    } catch (error) {
      return res.status(500).json({
        error: 'Error retrieving from database',
      });
    }

    // Ensure an actual object was found
    if (!getobj) {
      return res.status(404).json({
        error: 'Not found',
      });
    }

    // Ensure the authenticated user is author of this activity
    if (getobj.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        error: 'Wrong account',
      });
    }

    // Removed the deleted key
    getobj.deleted = undefined;

    // Save it to the database
    try {
      await getobj.save();
    } catch (error) {
      return res.status(500).json({
        error: 'Error saving to database',
      });
    }

    // Response
    return res.sendStatus(200);
  });

/**
 * Searches activities by custom criteria
 * @body {Integer} page - The page to send back (Items sent are based on page and pageSize)
 * @body {Integer} pageSize - The number of activities to return
 * @body {Integer} sort - The sorting method (see below)
 * @body {Boolean} reverse - Reverses the order of the sort
 * @body {Boolean} omitEnded - Omits activities that have already ended. Defaults to false
 * @body {Boolean} omitStarted - Omits activities that have already started. Defaults to false
 * @body {Boolean} maxDistance - Omits activities that are farther than this many miles away. Defaults to no limit
 * @body {Boolean} zipCode - Used with maxDistance for determining the center of the search radius
 *
 * Sorting methods:
 * 0 - Start time, soonest first
 * 1 - Date created, newest first
 */
activity.route('/search')
  .get(async (req, res) => {
    // Default variables for search
    const page = req.body.page || 1;
    const pageSize = req.body.pageSize || 20;
    const sort = req.body.sort || 0;
    const reverse = Boolean(req.body.reverse);
    const omitEnded = Boolean(req.body.omitEnded);
    const omitStarted = req.body.omitStarted || 0;
    const currentDateTime = Date.now();
    const maxDistance = req.body.maxDistance || 0;
    const zipCode = req.body.zipCode || -1;

    // Handle reversed data
    let rev = 1;
    if (reverse) {
      rev = -1;
    }

    // Limit allowed search size
    if (pageSize > 1000) {
      return res.status(400).json({
        error: 'pageSize is too large. Maximum is 1000',
      });
    }
    if (pageSize < 1) {
      return res.status(400).json({
        error: 'pageSize must be 1 or greater',
      });
    }

    // Limit page number
    if (page < 1) {
      return res.status(400).json({
        error: 'page must be 1 or greater',
      });
    }

    // Add filter and sort settings to the database query
    const filterSettings = {};
    let sortSettings = {};
    // Sorting methods
    if (sort === 0) {
      sortSettings = { startDateTime: (1 * rev), _id: (1 * rev) };
    } else if (sort === 1) {
      sortSettings = { creationDateTime: (-1 * rev), _id: (1 * rev) };
    } else {
      return res.status(400).json({
        error: 'Invalid sort method',
      });
    }
    // Filter ended activities
    if (omitEnded) {
      filterSettings.endDateTime = { $gt: currentDateTime };
    }
    // Filter started activities
    if (omitStarted) {
      filterSettings.startDateTime = { $gt: currentDateTime };
    }
    // Filter out activities marked as deleted
    filterSettings.deleted = { $ne: 1 };

    let getobjs;
    // Perform the search
    try {
      // The collection of found activities
      getobjs = await Activity
        .find(filterSettings)
        .sort(sortSettings)
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    } catch (error) {
      return res.status(500).json({
        error: 'Error retrieving from database',
      });
    }
    
    // Post-search culling (these checks require more complex calculations)
    // Distance checks
    if (maxDistance > 0) {
        for (let i = 0; i < getobjs.length; i ++) {
            //Figure out the zip codes we're comparing
            let zip1 = getobjs[i].zipCode;
            let zip2 = req.body.zipCode;
            let dist = 0;
            
            try {
                //Find these zip codes in the database
                let zip1Obj = await ZipCode.findOne({ zipCode:zip1 });
                let zip2Obj = await ZipCode.findOne({ zipCode:zip2 });
                
                //Find their latitudes and longitudes
                let lat1 = zip1Obj.Latitude;
                let lon1 = zip1Obj.Longitude;
                let lat2 = zip2Obj.Latitude;
                let lon2 = zip2Obj.Longitude;
                
                //Calculate their distance from each other
                //TODO: Convert all degrees to radians in the dataset to speed up these calculations
                dist = 3958.8 * Math.acos(Math.sin(lat1/57.2958) * Math.sin(lat2/57.2958) + Math.cos(lat1/57.2958) * Math.cos(lat2/57.2958) *  Math.cos(lon2/57.2958 - lon1/57.2958))
            } catch (error) {
                //If a zip code is invalid, consider them to be an infinite distance from each other
                dist = 999999999;
            }
            
            //If the activity is too far away, remove it from results
            if (dist > maxDistance) {
                getobjs.splice(i,1);
                i --;
            }
        }
    }

    // Collect every author, and create a list of { activity, author } objects
    // Results is a list of promises at first so we must wait until they resolve
    const results = getobjs.map(async (doc) => {
      const author = await getUserDataById(doc.postedBy);
      return {
        activity: doc,
        author,
      };
    });

    // Wait for all promises, then send response
    return Promise.all(results)
      .then((activities) => res.status(200).json({
        results: activities,
      }));
  });

/**
 * Returns activity data by id
 * Note that this route is on bottom to prevent any above
 * routes from matching to this by only having letters a-f
 * @param {Hex} id - The id of the activity, must be only hexadecimal
 */
activity.route('/:id([a-f0-9]+)')
  .get(async (req, res) => {
    // Get the activity from the database
    let getobj;
    try {
      getobj = await Activity.findById(req.params.id).exec();
    } catch (error) {
      return res.status(500).json({
        error: 'Error retrieving from database',
      });
    }
    
    // Ensure an actual object was found
    if (!getobj) {
      return res.status(404).json({
        error: 'Not found',
      });
    }

    // Ensure the item has not been deleted
    if (getobj.deleted === 1) {
      return res.status(404).json({
        error: 'Deleted',
      });
    }

    // Check if shortened data should be returned
    const shortened = Boolean(req.query.shortened);
    // Response
    return res.status(200).json({
      activity: getobj,
      author: await getUserDataById(getobj.postedBy),
      shortened,
    });
  });

module.exports = activity;
