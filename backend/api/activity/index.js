const express = require('express');
const Activity = require('../../database/models/activity');

const activity = express.Router();

/**
 * Creates a new activity and returns its data
 * @body {String} title - The title of the post
 * @body {String} description - The title of the post
 */
activity.route('/create')
  .post(async(req, res) => {
    const statusCode = 200;
	const currentDate = Date.now();
	const activity = new Activity({
		title: req.body.title,
		description: req.body.description,
		creationDateTime: currentDate,
		lastEditDateTime: currentDate,
	})
	await activity.save()
	//res.redirect('/activity/edit/#');
    res.status(statusCode).send(activity);
  });
  
/**
 * Edits activity by id
 * TODO: Implement this
 * @param {Number} id - The id of the activity, must be only digits
 */
activity.route('/edit/:id([0-9]+)')
  .post(async(req, res) => {
    const statusCode = 200;
    res.status(statusCode).json({
      id: req.params.id,
      status: statusCode,
    });
  });
  
/**
 * Searches posts by criteria specified in post data
 * TODO: Add search criteria
 * @body {Number} numPosts - The number of posts to return
 */
activity.route('/search')
  .get(async(req, res) => {
	numPosts = 20;
	if (Boolean(req.body.numPosts)) {
		numPosts = req.body.numPosts;
	}
	let getobj = await Activity.find( {creationDateTime: {$exists: true}} ).sort({creationDateTime : -1}).limit(numPosts);
	
    const statusCode = 200;
	
    res.status(statusCode).send(getobj);
  });

/**
 * Returns activity data by id
 * Note that this route is on bottom to prevent any above routes from matching to this by only having letters a-f
 * @param {Number} id - The id of the activity, must be only digits
 */
activity.route('/:id([a-f0-9]+)')
  .get(async(req, res) => {
	let getobj = await Activity.findById(req.params.id).exec();
	
    const statusCode = 200;
	const shortened = Boolean(req.query.shortened);
	
    res.status(statusCode).send(getobj);
  });

module.exports = activity;
