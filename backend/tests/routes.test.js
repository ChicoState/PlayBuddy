/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../index');

const agent = request.agent('localhost:3001');
const database = require('../database');

// Globals that keep track of database item id's
let post1Id;
let user1Id;
let user2Id;

// Drop the database so we start with a clean slate
database.dropDatabase();

afterAll(async () => {
  try {
    // Connection to Mongo killed.
    await mongoose.disconnect();
  } catch (error) {
    console.log(`
      Error!
      ${error}
    `);
    throw error;
  }
});

// Wait for the server to startup
beforeAll((done) => {
  setTimeout(done, 5000);
})

describe('Sessions', () => {
  it('Nonexistent route', (done) => {
    agent.get('/api/activity/void')
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(404);
        done();
      });
  });
  it('Route with wrong type of request 1', (done) => {
    agent.get('/api/activity/create')
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(404);
        done();
      });
  });
  it('Route with wrong type of request 2', (done) => {
    agent.post('/api/activity/search')
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(404);
        done();
      });
  });
  it('Register account', (done) => {
    agent.post('/api/auth/register')
      .send({ username: 'AzureDiamond', password: 'hunter2', email: 'test@test.com' })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        done();
      });
  });
  it('Log into registered account', (done) => {
    agent.post('/api/auth/login')
      .send({ username: 'AzureDiamond', password: 'hunter2' })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        done();
      });
  });
  it('Create activity', (done) => {
    agent.post('/api/activity/create')
      .send({ title: 'testtitle', description: 'testdescription' })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.activity.title).toEqual('testtitle');
        expect(res.body.activity.description).toEqual('testdescription');
        post1Id = res.body.activity._id;
        done();
      });
  });
  it('Create blank activity', (done) => {
    agent.post('/api/activity/create')
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.activity.title).toEqual('Unnamed activity');
        expect(res.body.activity.description).toEqual('No description offered');
        done();
      });
  });
  it('Create activity with dates; ongoing', (done) => {
    agent.post('/api/activity/create')
      .send({ title: 'ongoing', description: 'testdescription', startDateTime: 5, zipCode: 87110 })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.activity.title).toEqual('ongoing');
        expect(res.body.activity.description).toEqual('testdescription');
        const startDateTime = new Date(res.body.activity.startDateTime);
        expect(startDateTime.getTime()).toEqual(5);
        done();
      });
  });
  it('Create activity with dates; ended', (done) => {
    agent.post('/api/activity/create')
      .send({
        title: 'ended', description: 'testdescription', startDateTime: 1, endDateTime: 2, zipCode: 89031
      })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.activity.title).toEqual('ended');
        expect(res.body.activity.description).toEqual('testdescription');
        const startDateTime = new Date(res.body.activity.startDateTime);
        const endDateTime = new Date(res.body.activity.endDateTime);
        expect(startDateTime.getTime()).toEqual(1);
        expect(endDateTime.getTime()).toEqual(2);
        done();
      });
  });
  it('Create activity with invalid dates', (done) => {
    agent.post('/api/activity/create')
      .send({
        title: 'testtitle', description: 'testdescription', startDateTime: 3, endDateTime: 2,
      })
      .end((err, res) => {
        expect(res.status).toEqual(400);
        done();
      });
  });
  it('Check created activity', (done) => {
    agent.get(`/api/activity/${post1Id}`)
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.activity.title).toEqual('testtitle');
        expect(res.body.activity.description).toEqual('testdescription');
        done();
      });
  });
  it('Check nonexistent activity', (done) => {
    agent.get('/api/activity/aaaaaaaaaaaaaaaaaaaaaaaa')
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(404);
        expect(res.body.error).toEqual('Not found');
        done();
      });
  });
  it('Check invalid activity', (done) => {
    agent.get('/api/activity/aaa')
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(500);
        expect(res.body.error).toEqual('Error retrieving from database');
        done();
      });
  });
  it('Edit activity', (done) => {
    agent.post(`/api/activity/edit/${post1Id}`)
      .send({ title: 'newtitle', description: 'newdescription' })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.activity.title).toEqual('newtitle');
        expect(res.body.activity.description).toEqual('newdescription');
        done();
      });
  });
  it('Check edited activity', (done) => {
    agent.get(`/api/activity/${post1Id}`)
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.activity.title).toEqual('newtitle');
        expect(res.body.activity.description).toEqual('newdescription');
        done();
      });
  });
  it('Delete activity', (done) => {
    agent.post(`/api/activity/delete/${post1Id}`)
      .send()
      .end((err, res) => {
        expect(res.status).toEqual(200);
        done();
      });
  });
  it('Check deleted activity', (done) => {
    agent.get(`/api/activity/${post1Id}`)
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(404);
        expect(res.body.error).toEqual('Deleted');
        done();
      });
  });
  it('Restore activity', (done) => {
    agent.post(`/api/activity/restore/${post1Id}`)
      .send()
      .end((err, res) => {
        expect(res.status).toEqual(200);
        done();
      });
  });
  it('Check restored activity', (done) => {
    agent.get(`/api/activity/${post1Id}`)
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.activity.title).toEqual('newtitle');
        expect(res.body.activity.description).toEqual('newdescription');
        done();
      });
  });
  it('Edit nonexistent activity', (done) => {
    agent.post('/api/activity/edit/' + 'aaaaaaaaaaaaaaaaaaaaaaaa')
      .send({ title: 'newtitle', description: 'newdescription' })
      .end((err, res) => {
        expect(res.status).toEqual(404);
        done();
      });
  });
  it('Delete nonexistent activity', (done) => {
    agent.post('/api/activity/delete/' + 'aaaaaaaaaaaaaaaaaaaaaaaa')
      .send({ title: 'newtitle', description: 'newdescription' })
      .end((err, res) => {
        expect(res.status).toEqual(404);
        done();
      });
  });
  it('Restore nonexistent activity', (done) => {
    agent.post('/api/activity/restore/' + 'aaaaaaaaaaaaaaaaaaaaaaaa')
      .send({ title: 'newtitle', description: 'newdescription' })
      .end((err, res) => {
        expect(res.status).toEqual(404);
        done();
      });
  });
  it('Simple search', (done) => {
    agent.get('/api/activity/search')
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.results.length).toEqual(4);
        done();
      });
  });
  it('Search omit ended', (done) => {
    agent.get('/api/activity/search')
      .send({ omitEnded: true })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.results.length).toEqual(3);
        done();
      });
  });
  it('Search omit started', (done) => {
    agent.get('/api/activity/search')
      .send({ omitStarted: true })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.results.length).toEqual(2);
        done();
      });
  });
  it('Search sort by date created', (done) => {
    agent.get('/api/activity/search')
      .send({ sort: 1 })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.results[0].activity.title).toEqual('ended');
        expect(res.body.results[1].activity.title).toEqual('ongoing');
        expect(res.body.results[2].activity.title).toEqual('Unnamed activity');
        expect(res.body.results[3].activity.title).toEqual('newtitle');
        done();
      });
  });
  it('Search reversed sort by date created', (done) => {
    agent.get('/api/activity/search')
      .send({ sort: 1, reverse: 1 })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.results[0].activity.title).toEqual('newtitle');
        expect(res.body.results[1].activity.title).toEqual('Unnamed activity');
        expect(res.body.results[2].activity.title).toEqual('ongoing');
        expect(res.body.results[3].activity.title).toEqual('ended');
        done();
      });
  });
  it('Search sort by start time', (done) => {
    agent.get('/api/activity/search')
      .send({ sort: 0 })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.results[0].activity.title).toEqual('ended');
        expect(res.body.results[1].activity.title).toEqual('ongoing');
        expect(res.body.results[2].activity.title).toEqual('newtitle');
        expect(res.body.results[3].activity.title).toEqual('Unnamed activity');
        done();
      });
  });
  it('Search invalid sort', (done) => {
    agent.get('/api/activity/search')
      .send({ sort: -6 })
      .end((err, res) => {
        expect(res.status).toEqual(400);
        done();
      });
  });
  it('Search pagination, page 1', (done) => {
    agent.get('/api/activity/search')
      .send({ sort: 0, page: 1, pageSize: 2 })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.results[0].activity.title).toEqual('ended');
        expect(res.body.results[1].activity.title).toEqual('ongoing');
        expect(res.body.results.length).toEqual(2);
        done();
      });
  });
  it('Search pagination, page 2', (done) => {
    agent.get('/api/activity/search')
      .send({ sort: 0, page: 2, pageSize: 2 })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.results[0].activity.title).toEqual('newtitle');
        expect(res.body.results[1].activity.title).toEqual('Unnamed activity');
        expect(res.body.results.length).toEqual(2);
        done();
      });
  });
  it('Search pagination, out of pages', (done) => {
    agent.get('/api/activity/search')
      .send({ sort: 0, page: 2, pageSize: 3 })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.results[0].activity.title).toEqual('Unnamed activity');
        expect(res.body.results.length).toEqual(1);
        done();
      });
  });
  it('Search pagination, invalid page', (done) => {
    agent.get('/api/activity/search')
      .send({ sort: 0, page: -1, pageSize: 3 })
      .end((err, res) => {
        expect(res.status).toEqual(400);
        done();
      });
  });
  it('Search pagination, invalid pageSize', (done) => {
    agent.get('/api/activity/search')
      .send({ sort: 0, page: 1, pageSize: -1 })
      .end((err, res) => {
        expect(res.status).toEqual(400);
        done();
      });
  });
  it('Filter by distance, invalid zip code', (done) => {
    agent.get('/api/activity/search')
      .send({ maxDistance:5, zipCode:-1 })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.results.length).toEqual(0);
        done();
      });
  });
  it('Filter by distance, short distance', (done) => {
    agent.get('/api/activity/search')
      .send({ maxDistance:1, zipCode:89104 })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.results.length).toEqual(0);
        done();
      });
  });
  it('Filter by distance, medium distance', (done) => {
    agent.get('/api/activity/search')
      .send({ maxDistance:50, zipCode:89104 })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.results.length).toEqual(1);
        done();
      });
  });
  it('Filter by distance, long distance', (done) => {
    agent.get('/api/activity/search')
      .send({ maxDistance:5000, zipCode:89104 })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.results.length).toEqual(2);
        done();
      });
  });
  it('Find user by username', (done) => {
    agent.get('/api/user/AzureDiamond')
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.user.username).toEqual('AzureDiamond');
        user1Id = res.body.user._id;
        done();
      });
  });
  it('Find user by id', (done) => {
    agent.get(`/api/user/${user1Id}`)
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.user.username).toEqual('AzureDiamond');
        done();
      });
  });
  it('Register another account', (done) => {
    agent.post('/api/auth/register')
      .send({ username: 'user', password: 'pass', email: 'test2@test.com' })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        done();
      });
  });
  it('Incorrect password', (done) => {
    agent.post('/api/auth/login')
      .send({ username: 'user', password: 'wrongpassword' })
      .end((err, res) => {
        expect(res.status).toEqual(401);
        done();
      });
  });
  it('Log into new registered account', (done) => {
    agent.post('/api/auth/login')
      .send({ username: 'user', password: 'pass' })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        done();
      });
  });
  it('Edit unauthorized activity', (done) => {
    agent.post(`/api/activity/edit/${post1Id}`)
      .send({ title: 'unauthorizedtitle', description: 'unauthorizeddescription' })
      .end((err, res) => {
        expect(res.status).toEqual(403);
        done();
      });
  });
  it('Delete unauthorized activity', (done) => {
    agent.post(`/api/activity/edit/${post1Id}`)
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(403);
        done();
      });
  });
  it('Restore unauthorized activity', (done) => {
    agent.post(`/api/activity/edit/${post1Id}`)
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(403);
        done();
      });
  });
  it('Check unauthorized edit did not apply', (done) => {
    agent.get(`/api/activity/${post1Id}`)
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.activity.title).toEqual('newtitle');
        expect(res.body.activity.description).toEqual('newdescription');
        done();
      });
  });
  it('Find new user by username', (done) => {
    agent.get('/api/user/user')
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.user.username).toEqual('user');
        user2Id = res.body.user._id;
        done();
      });
  });
  it('Edit user information', (done) => {
    agent.post(`/api/user/edit/${user2Id}`)
      .send({ username: 'Cthon98', password: 'newpass' })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        done();
      });
  });
  it('Find edited user by username', (done) => {
    agent.get('/api/user/Cthon98')
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.user.username).toEqual('Cthon98');
        user2Id = res.body.user._id;
        done();
      });
  });
  it('Fail to find user by old username', (done) => {
    agent.get('/api/user/user')
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(404);
        done();
      });
  });
  it('Log out', (done) => {
    agent.post('/api/auth/logout')
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(200);
        done();
      });
  });
  it('Edit activity while not logged in', (done) => {
    agent.post(`/api/activity/edit/${post1Id}`)
      .send({ title: 'unauthorizedtitle', description: 'unauthorizeddescription' })
      .end((err, res) => {
        expect(res.status).toEqual(401);
        done();
      });
  });
  it('Delete activity while not logged in', (done) => {
    agent.post(`/api/activity/delete/${post1Id}`)
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(401);
        done();
      });
  });
  it('Restore activity while not logged in', (done) => {
    agent.post(`/api/activity/restore/${post1Id}`)
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(401);
        done();
      });
  });
  it('Check logged-out edit did not apply', (done) => {
    agent.get(`/api/activity/${post1Id}`)
      .send({})
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.activity.title).toEqual('newtitle');
        expect(res.body.activity.description).toEqual('newdescription');
        done();
      });
  });
  it('Log into nonexistent account', (done) => {
    agent.post('/api/auth/login')
      .send({ username: 'doesnotexist', password: 'pass' })
      .end((err, res) => {
        expect(res.status).toEqual(401);
        done();
      });
  });
});
