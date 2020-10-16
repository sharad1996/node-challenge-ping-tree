process.env.NODE_ENV = 'test'

const test = require('ava')
const request = require('supertest');
const mongoose = require('mongoose');

const server = require('../lib/server')
const Target = require('../models/target');

// Create connection to Mongoose before tests are run
test.before(async () => {
  const uri = 'mongodb://127.0.0.1:27017/pingtree'
  await mongoose.connect(uri);
});

// You'll want to populate your database with dummy data. Here's an example
test.beforeEach(async () => {
  const target = new Target({
    url: 'www.example.com',
    value: '0.20',
    maxAcceptsPerDay: 10,
    accept: {
      geoState: ['ca'],
      hour: [13, 15]
    }
  });
  await target.save();
});

// Dummy data should be cleared after each test:
test.afterEach.always(() => Target.remove());

test.serial.cb('healthcheck', function (t) {
  const url = '/health'
  request(server(), url, { encoding: 'json' }, function (err, res) {
    t.falsy(err, 'no error')

    t.is(res.statusCode, 200, 'correct statusCode')
    t.is(res.body.status, 'OK', 'status is ok')
    t.end()
  })
})

test.serial('Create a new target', async t => {
  const response = await request(server)
    .post('/api/targets')
    .send({
      url: 'www.example.com',
      value: '0.20',
    })
  t.is(response.status, 200)
  t.is(response.body.msg, `add target successfully`)
  // Verify that target is created in DB
  const newTarget = await Target.findOne({ url: 'www.example.com' });
  t.is(newTarget.value, '0.20');
})

test.serial('Get all targets', async t => {
  const { server } = t.context;
  const response = await request(server)
    .get('/api/targets')
    .send({ payload })
  t.is(response.status, 200)
  t.is(response.body.targets, response)
})

test.serial('Get target by id', async t => {
  const response = await request(server)
    .get('/api/target/:id')
    .send({ payload })
  t.is(response.status, 200)
  t.is(response.body.target, response)
})

test.serial('Update target by id', async t => {
  const response = await request(server)
    .post('/api/target/:id')
    .send({
      url: 'www.example.com',
      value: '0.30',
    })
  t.is(response.status, 200)
  t.is(response.body.target, response)
  // Verify that target is updated in DB
  const updateTarget = await Target.findOne({ url: 'www.example.com' });
  t.is(updateTarget.value, '0.30');
})

// Visitor api test
test.serial('vistior decision test', async t => {
  const response = await request(server)
    .post('/route')
    .send({
      geoState: "ca",
      publisher: "abc",
      timestamp: "2018-07-19T23:28:59.513Z"
    })
  const hour = new Date(timestamp).getHours()
  const targets = await Target.find({
    "accept.geoState": { $in: "ca" },
    "accept.hour": { $in: hour }
  })
  const target = targets.reduce((prev, current) => (prev.value > current.value) ? prev : current)
  t.is(response.status, 200)
  t.is(response.body.decision, target.url)
})

// Mongo disconnect after test
test.after.always(async () => {
  mongoose.disconnect()
})
