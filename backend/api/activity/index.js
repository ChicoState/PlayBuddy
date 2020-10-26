const express = require('express');
const passport = require('passport');
const Activity = require('../../database/models/activity');

const activity = express.Router();

/**
 * Creates a new activity and returns its data
 * @body {String} title - The title of the post
 * @body {String} description - The title of the post
 */
activity.route('/create')
  .post(passport.authenticate('local'), async (req, res) => {
    if (!req.user) {
      return res.status(403).json({
        error: 'Not authenticated',
      });
    }
    const statusCode = 200;
    const currentDate = Date.now();
    const activitydata = new Activity({
      title: req.body.title,
      description: req.body.description,
      creationDateTime: currentDate,
      lastEditDateTime: currentDate,
      postedBy: req.user.id,
    });
    try {
      await activitydata.save();
      return res.status(statusCode).json({ activity: activitydata });
    } catch (error) {
      return res.status(500).send(error);
    }
  });

/**
 * Edits activity by id
 * TODO: Implement this
 * @param {Number} id - The id of the activity, must be only digits
 */
activity.route('/edit/:id([0-9]+)')
  .post(passport.authenticate('local'), async (req, res) => {
    if (!req.user) {
      return res.status(403).json({
        error: 'Not authenticated',
      });
    }
    const statusCode = 200;
    const shortened = Boolean(req.query.shortened);
    return res.status(statusCode).json({
      id: req.params.id,
      status: statusCode,
      shortened,
    });
  });

/**
 * Searches posts by criteria specified in post data
 * TODO: Add search criteria
 * @body {Number} numPosts - The number of posts to return
 */
activity.route('/search')
  .get(async (req, res) => {
    const numPosts = req.body.numPosts || 20;
    try {
      const getobj = await Activity
        .find({ creationDateTime: { $exists: true } })
        .sort({ creationDateTime: -1 })
        .limit(numPosts);
      const statusCode = 200;
      res.status(statusCode).json({
        activity: getobj,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  });

/**
 * Returns activity data by id
 * Note that this route is on bottom to prevent any above
 * routes from matching to this by only having letters a-f
 * @param {Number} id - The id of the activity, must be only hexadecimal
 */
activity.route('/:id([a-f0-9]+)')
  .get(async (req, res) => {
    try {
      const getobj = await Activity.findById(req.params.id).exec();
      const statusCode = 200;
      const shortened = Boolean(req.query.shortened);
      res.status(statusCode).json({
        activity: getobj,
        shortened,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = activity;
