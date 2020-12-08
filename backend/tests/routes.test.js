var request = require('supertest');
var server = require('../index');
var agent = request.agent('localhost:3001');
var database = require('../database');

//Globals that keep track of database item id's
let post1_id;
let user1_id;
let user2_id;

//Drop the database so we start with a clean slate
database.dropDatabase();

describe('Sessions', function() {
	it('Nonexistent route', function(done) {
		agent.get('/api/activity/void')
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(404);
			done();
		});
	});
	it('Route with wrong type of request 1', function(done) {
		agent.get('/api/activity/create')
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(404);
			done();
		});
	});
	it('Route with wrong type of request 2', function(done) {
		agent.post('/api/activity/search')
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(404);
			done();
		});
	});
	it('Register account', function(done) {
		agent.post('/api/auth/register')
		.send({ username: 'AzureDiamond', password: 'hunter2', email: 'test@test.com' })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			done();
		});
	});
	it('Log into registered account', function(done) {
		agent.post('/api/auth/login')
		.send({ username: 'AzureDiamond', password: 'hunter2' })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			done();
		});
	});
	it('Create activity', function(done) {
		agent.post('/api/activity/create')
		.send({ title: 'testtitle', description: 'testdescription' })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.activity.title).toEqual('testtitle');
			expect(res.body.activity.description).toEqual('testdescription');
			post1_id = res.body.activity._id;
			done();
		});
	});
	it('Create blank activity', function(done) {
		agent.post('/api/activity/create')
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.activity.title).toEqual('Unnamed activity');
			expect(res.body.activity.description).toEqual('No description offered');
			done();
		});
	});
	it('Create activity with dates; ongoing', function(done) {
		agent.post('/api/activity/create')
		.send({ title: 'ongoing', description: 'testdescription', startDateTime: 5})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.activity.title).toEqual('ongoing');
			expect(res.body.activity.description).toEqual('testdescription');
			let startDateTime = new Date(res.body.activity.startDateTime);
			expect(startDateTime.getTime()).toEqual(5);
			done();
		});
	});
	it('Create activity with dates; ended', function(done) {
		agent.post('/api/activity/create')
		.send({ title: 'ended', description: 'testdescription', startDateTime: 1, endDateTime: 2})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.activity.title).toEqual('ended');
			expect(res.body.activity.description).toEqual('testdescription');
			let startDateTime = new Date(res.body.activity.startDateTime);
			let endDateTime = new Date(res.body.activity.endDateTime);
			expect(startDateTime.getTime()).toEqual(1);
			expect(endDateTime.getTime()).toEqual(2);
			done();
		});
	});
	it('Create activity with invalid dates', function(done) {
		agent.post('/api/activity/create')
		.send({ title: 'testtitle', description: 'testdescription', startDateTime: 3, endDateTime: 2 })
		.end(function(err, res) {
			expect(res.status).toEqual(400);
			done();
		});
	});
	it('Check created activity', function(done) {
		agent.get('/api/activity/' + post1_id)
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.activity.title).toEqual('testtitle');
			expect(res.body.activity.description).toEqual('testdescription');
			done();
		});
	});
	it('Check nonexistent activity', function(done) {
		agent.get('/api/activity/' + 'aaaaaaaaaaaaaaaaaaaaaaaa')
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(404);
			expect(res.body.error).toEqual('Not found');
			done();
		});
	});
	it('Check invalid activity', function(done) {
		agent.get('/api/activity/' + 'aaa')
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(500);
			expect(res.body.error).toEqual('Error retrieving from database');
			done();
		});
	});
	it('Edit activity', function(done) {
		agent.post('/api/activity/edit/' + post1_id)
		.send({ title: 'newtitle', description: 'newdescription' })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.activity.title).toEqual('newtitle');
			expect(res.body.activity.description).toEqual('newdescription');
			done();
		});
	});
	it('Check edited activity', function(done) {
		agent.get('/api/activity/' + post1_id)
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.activity.title).toEqual('newtitle');
			expect(res.body.activity.description).toEqual('newdescription');
			done();
		});
	});
	it('Delete activity', function(done) {
		agent.post('/api/activity/delete/' + post1_id)
		.send()
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			done();
		});
	});
	it('Check deleted activity', function(done) {
		agent.get('/api/activity/' + post1_id)
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(404);
			expect(res.body.error).toEqual('Deleted');
			done();
		});
	});
	it('Restore activity', function(done) {
		agent.post('/api/activity/restore/' + post1_id)
		.send()
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			done();
		});
	});
	it('Check restored activity', function(done) {
		agent.get('/api/activity/' + post1_id)
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.activity.title).toEqual('newtitle');
			expect(res.body.activity.description).toEqual('newdescription');
			done();
		});
	});
	it('Edit nonexistent activity', function(done) {
		agent.post('/api/activity/edit/' + 'aaaaaaaaaaaaaaaaaaaaaaaa')
		.send({ title: 'newtitle', description: 'newdescription' })
		.end(function(err, res) {
			expect(res.status).toEqual(404);
			done();
		});
	});
	it('Delete nonexistent activity', function(done) {
		agent.post('/api/activity/delete/' + 'aaaaaaaaaaaaaaaaaaaaaaaa')
		.send({ title: 'newtitle', description: 'newdescription' })
		.end(function(err, res) {
			expect(res.status).toEqual(404);
			done();
		});
	});
	it('Restore nonexistent activity', function(done) {
		agent.post('/api/activity/restore/' + 'aaaaaaaaaaaaaaaaaaaaaaaa')
		.send({ title: 'newtitle', description: 'newdescription' })
		.end(function(err, res) {
			expect(res.status).toEqual(404);
			done();
		});
	});
	it('Simple search', function(done) {
		agent.get('/api/activity/search')
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.results.length).toEqual(4);
			done();
		});
	});
	it('Search omit ended', function(done) {
		agent.get('/api/activity/search')
		.send({ omitEnded:true })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.results.length).toEqual(3);
			done();
		});
	});
	it('Search omit started', function(done) {
		agent.get('/api/activity/search')
		.send({ omitStarted:true })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.results.length).toEqual(2);
			done();
		});
	});
	it('Search sort by date created', function(done) {
		agent.get('/api/activity/search')
		.send({ sort:1 })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.results[0].activity.title).toEqual('ended');
			expect(res.body.results[1].activity.title).toEqual('ongoing');
			expect(res.body.results[2].activity.title).toEqual('Unnamed activity');
			expect(res.body.results[3].activity.title).toEqual('newtitle');
			done();
		});
	});
	it('Search reversed sort by date created', function(done) {
		agent.get('/api/activity/search')
		.send({ sort:1 , reverse:1 })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.results[0].activity.title).toEqual('newtitle');
			expect(res.body.results[1].activity.title).toEqual('Unnamed activity');
			expect(res.body.results[2].activity.title).toEqual('ongoing');
			expect(res.body.results[3].activity.title).toEqual('ended');
			done();
		});
	});
	it('Search sort by start time', function(done) {
		agent.get('/api/activity/search')
		.send({ sort:0 })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.results[0].activity.title).toEqual('ended');
			expect(res.body.results[1].activity.title).toEqual('ongoing');
			expect(res.body.results[2].activity.title).toEqual('newtitle');
			expect(res.body.results[3].activity.title).toEqual('Unnamed activity');
			done();
		});
	});
	it('Search invalid sort', function(done) {
		agent.get('/api/activity/search')
		.send({ sort:-6 })
		.end(function(err, res) {
			expect(res.status).toEqual(400);
			done();
		});
	});
	it('Search pagination, page 1', function(done) {
		agent.get('/api/activity/search')
		.send({ sort:0, page:1, pageSize:2 })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.results[0].activity.title).toEqual('ended');
			expect(res.body.results[1].activity.title).toEqual('ongoing');
			expect(res.body.results.length).toEqual(2);
			done();
		});
	});
	it('Search pagination, page 2', function(done) {
		agent.get('/api/activity/search')
		.send({ sort:0, page:2, pageSize:2 })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.results[0].activity.title).toEqual('newtitle');
			expect(res.body.results[1].activity.title).toEqual('Unnamed activity');
			expect(res.body.results.length).toEqual(2);
			done();
		});
	});
	it('Search pagination, out of pages', function(done) {
		agent.get('/api/activity/search')
		.send({ sort:0, page:2, pageSize:3 })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.results[0].activity.title).toEqual('Unnamed activity');
			expect(res.body.results.length).toEqual(1);
			done();
		});
	});
	it('Search pagination, invalid page', function(done) {
		agent.get('/api/activity/search')
		.send({ sort:0, page:-1, pageSize:3 })
		.end(function(err, res) {
			expect(res.status).toEqual(400);
			done();
		});
	});
	it('Search pagination, invalid pageSize', function(done) {
		agent.get('/api/activity/search')
		.send({ sort:0, page:1, pageSize:-1 })
		.end(function(err, res) {
			expect(res.status).toEqual(400);
			done();
		});
	});
	it('Find user by username', function(done) {
		agent.get('/api/user/AzureDiamond')
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.user.username).toEqual('AzureDiamond');
			user1_id = res.body.user._id;
			done();
		});
	});
	it('Find user by id', function(done) {
		agent.get('/api/user/' + user1_id)
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.user.username).toEqual('AzureDiamond');
			done();
		});
	});
	it('Register another account', function(done) {
		agent.post('/api/auth/register')
		.send({ username: 'user', password: 'pass', email: 'test2@test.com' })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			done();
		});
	});
	it('Incorrect password', function(done) {
		agent.post('/api/auth/login')
		.send({ username: 'user', password: 'wrongpassword' })
		.end(function(err, res) {
			expect(res.status).toEqual(401);
			done();
		});
	});
	it('Log into new registered account', function(done) {
		agent.post('/api/auth/login')
		.send({ username: 'user', password: 'pass' })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			done();
		});
	});
	it('Edit unauthorized activity', function(done) {
		agent.post('/api/activity/edit/' + post1_id)
		.send({ title: 'unauthorizedtitle', description: 'unauthorizeddescription' })
		.end(function(err, res) {
			expect(res.status).toEqual(403);
			done();
		});
	});
	it('Delete unauthorized activity', function(done) {
		agent.post('/api/activity/edit/' + post1_id)
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(403);
			done();
		});
	});
	it('Restore unauthorized activity', function(done) {
		agent.post('/api/activity/edit/' + post1_id)
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(403);
			done();
		});
	});
	it('Check unauthorized edit did not apply', function(done) {
		agent.get('/api/activity/' + post1_id)
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.activity.title).toEqual('newtitle');
			expect(res.body.activity.description).toEqual('newdescription');
			done();
		});
	});
	it('Find new user by username', function(done) {
		agent.get('/api/user/user')
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.user.username).toEqual('user');
			user2_id = res.body.user._id;
			done();
		});
	});
	it('Edit user information', function(done) {
		agent.post('/api/user/edit/' + user2_id)
		.send({ username: 'Cthon98', password: 'newpass' })
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			done();
		});
	});
	it('Find edited user by username', function(done) {
		agent.get('/api/user/Cthon98')
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.user.username).toEqual('Cthon98');
			user2_id = res.body.user._id;
			done();
		});
	});
	it('Fail to find user by old username', function(done) {
		agent.get('/api/user/user')
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(404);
			done();
		});
	});
	it('Log out', function(done) {
		agent.post('/api/auth/logout')
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			done();
		});
	});
	it('Edit activity while not logged in', function(done) {
		agent.post('/api/activity/edit/' + post1_id)
		.send({ title: 'unauthorizedtitle', description: 'unauthorizeddescription' })
		.end(function(err, res) {
			expect(res.status).toEqual(401);
			done();
		});
	});
	it('Delete activity while not logged in', function(done) {
		agent.post('/api/activity/delete/' + post1_id)
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(401);
			done();
		});
	});
	it('Restore activity while not logged in', function(done) {
		agent.post('/api/activity/restore/' + post1_id)
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(401);
			done();
		});
	});
	it('Check logged-out edit did not apply', function(done) {
		agent.get('/api/activity/' + post1_id)
		.send({})
		.end(function(err, res) {
			expect(res.status).toEqual(200);
			expect(res.body.activity.title).toEqual('newtitle');
			expect(res.body.activity.description).toEqual('newdescription');
			done();
		});
	});
	it('Log into nonexistent account', function(done) {
		agent.post('/api/auth/login')
		.send({ username: 'doesnotexist', password: 'pass' })
		.end(function(err, res) {
			expect(res.status).toEqual(401);
			done();
		});
	});
});




