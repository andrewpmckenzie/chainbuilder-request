var assert = require('chai').assert;
var chainBuilder = require('chainbuilder');
var nock = require('nock');

describe('chainbuilder-request', function () {

  var myChain;
  beforeEach(function () {
    myChain = chainBuilder({
      methods: {
        inject: function (val, done) { done(null, val); }
      },
      mixins: [
        require('..')()
      ]
    });
  });
  afterEach(function () { nock.cleanAll(); });

  describe('#request (returns response)', function () {
    it('accepts a request options param', function (done) {
      // Setup mock responses
      nock('http://www.example.com').post('/user-two', { token: 'foo' }).reply(200, 'ok');

      // Run the test
      myChain()
        .request({
          url: 'http://www.example.com/user-two',
          method: 'POST',
          form: { token: 'foo' }
        })
        .tap(function (err, result) {
          if (err) return;
          assert.equal(result.statusCode, 200);
          assert.equal(result.body, 'ok');
        })
        .end(done)
    });
  });

  describe('#requestJson (returns body as JSON)', function () {
    it('accepts a string param', function (done) {
      // Setup mock responses
      nock('http://www.example.com').get('/user-one').reply(200, { name: 'fred' });

      // Run the test
      myChain()
        .requestJson('http://www.example.com/user-one')
        .tap(function (err, result) {
          if (err) return;
          assert.deepEqual(result, { name: 'fred' });
        })
        .end(done);
    });

    it('accepts a request options param', function (done) {
      // Setup mock responses
      nock('http://www.example.com').post('/user-two', { token: 'foo' }).reply(200, { name: 'sarah' });

      // Run the test
      myChain()
        .requestJson({
          url: 'http://www.example.com/user-two',
          method: 'POST',
          form: { token: 'foo' }
        })
        .tap(function (err, result) {
          if (err) return;
          assert.deepEqual(result, { name: 'sarah' });
        })
        .end(done)
    });

    it('generates options from a provided function', function (done) {
      // Setup mock responses
      nock('http://www.example.com').get('/user-three').reply(200, { name: 'sam' });

      // Run the test
      myChain()
        .inject('http://www.example.com')
        .requestJson(function () { return this.previousResult() + '/user-three'; })
        .tap(function (err, result) {
          if (err) return;
          assert.deepEqual(result, { name: 'sam' });
        })
        .end(done)
    });

    it('uses previousResult if no param is provided', function (done) {
      // Setup mock responses
      nock('http://www.example.com').get('/user-four').reply(200, { name: 'jill' });

      // Run the test
      myChain()
        .inject('http://www.example.com/user-four')
        .requestJson()
        .tap(function (err, result) {
          if (err) return;
          assert.deepEqual(result, { name: 'jill' });
        })
        .end(done);
    });

    it('intercepts errors', function (done) {
      // Setup mock responses
      nock('http://www.example.com').get('/user-five').reply(500, 'BANG');

      // Run the test
      myChain()
        .requestJson('http://www.example.com/user-five')
        .end(function (err) {
          assert.deepEqual(err && err.message, 'Received 500 response: BANG');
          done();
        })
    });
  });

  describe('#requestBody (returns body as string/default)', function () {
    it('accepts a string param', function (done) {
      // Setup mock responses
      nock('http://www.example.com').get('/user-one').reply(200, 'fred');

      // Run the test
      myChain()
        .requestBody('http://www.example.com/user-one')
        .tap(function (err, result) {
          if (err) return;
          assert.equal(result, 'fred');
        })
        .end(done);
    });

    it('accepts a request options param', function (done) {
      // Setup mock responses
      nock('http://www.example.com').post('/user-two', { token: 'foo' }).reply(200, { name: 'sarah' });

      // Run the test
      myChain()
        .requestBody({
          url: 'http://www.example.com/user-two',
          method: 'POST',
          form: { token: 'foo' },
          json: true
        })
        .tap(function (err, result) {
          if (err) return;
          assert.deepEqual(result, { name: 'sarah' });
        })
        .end(done)
    });

    it('generates options from a provided function', function (done) {
      // Setup mock responses
      nock('http://www.example.com').get('/user-three').reply(200, { name: 'sam' });

      // Run the test
      myChain()
        .inject('http://www.example.com')
        .requestBody(function () { return this.previousResult() + '/user-three'; })
        .tap(function (err, result) {
          if (err) return;
          assert.equal(result, '{"name":"sam"}');
        })
        .end(done)
    });

    it('uses previousResult if no param is provided', function (done) {
      // Setup mock responses
      nock('http://www.example.com').get('/user-four').reply(200, 'jill');

      // Run the test
      myChain()
        .inject('http://www.example.com/user-four')
        .requestBody()
        .tap(function (err, result) {
          if (err) return;
          assert.equal(result, 'jill');
        })
        .end(done)
    });
  });

});
