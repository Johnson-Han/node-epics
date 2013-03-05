var epics = require('../main')
  , assert = require('assert')
  , spawn = require('child_process').spawn
  , path = require('path')
  , codes = require('../lib/codes');

var ioc = spawn('python', [path.join(__dirname, 'ioc.py')]);
ioc.stderr.on('data', function(data) {
  console.log('Error running IOC:\n', data.toString());
});

describe('channel', function() {
  after(function() {
    ioc.kill();
  });
  describe('connection:', function() {
    describe('valid pv:', function() {
      var pv;
      before(function(done) {
        pv = new epics.Channel('NODE_EPICS_TEST:CONNECTION');
        done();
      });
      describe('before connecting', function() {
        it('state should be CS_CLOSED', function() {
          assert.equal(pv.state(), codes.state.CS_CLOSED);
        });
        it('connected should be False', function() {
          assert.equal(pv.connected(), false);
        });
      });
      describe('after connecting', function() {
        var err;
        before(function(done) {
          pv.connect(function(_err) {
            err = _err;
            //pv.monitor();
            done();
          });
        });
        it('err should be null', function() {
          assert.equal(err, null);
        });
        it('state should be CS_CONN', function() {
          assert.equal(pv.state(), codes.state.CS_CONN);
        });
        it('connected should be true', function() {
          assert.equal(pv.connected(), true);
        });
      });
      describe('disconnecting', function() {
        it('err should be null', function(done) {
          pv.disconnect(function(err) {
            assert.equal(err, null);
            done();
          });
        });
        it('state should be CS_CLOSED', function() {
          assert.equal(pv.state(), codes.state.CS_CLOSED);
        });
        it('connected should be false', function() {
          //assert.equal(pv.connected(), false);
        });
      });
    });
    describe('invalid pv:', function() {
      var pv;
      before(function(done) {
        pv = new epics.Channel('NODE_EPICS_TEST:INVALID_NAME');
        done();
      });
      describe('after connecting', function() {
        var err;
        before(function(done) {
          pv.connect(function(_err) {
            err = _err;
            done();
          });
        });
        it('err should be "Connection not established."', function() {
          assert.equal(err.message, 'Never connected.');
        });
        it('state should be CS_CONN', function() {
          assert.equal(pv.state(), codes.state.CS_NEVER_CONN);
        });
        it('connected should be true', function() {
          assert.equal(pv.connected(), false);
        });
      });
      describe('disconnecting', function() {
        it('err should be null', function(done) {
          pv.disconnect(function(err) {
            assert.equal(err, null);
            done();
          });
        });
        it('state should be CS_CLOSED', function() {
          assert.equal(pv.state(), codes.state.CS_CLOSED);
        });
        it('connected should be false', function() {
          assert.equal(pv.connected(), false);
        });
      });
    });
  });
  describe('get:', function() {
    describe('type string', function() {
      var pv;
      before(function(done) {
        pv = new epics.Channel('NODE_EPICS_TEST:STRING');
        pv.connect(function(err) {
          done();
        });
      });
      it('should return "a sufficiently long string"', function(done) {
        pv.get(function(err, value) {
          assert.equal(value, 'a sufficiently long string');
          done();
        });
      });
    });
    describe('type int', function() {
      var pv;
      before(function(done) {
        pv = new epics.Channel('NODE_EPICS_TEST:INT');
        pv.connect(function(err) {
          done();
        });
      });
      it('should return 7', function(done) {
        pv.get(function(err, value) {
          assert.equal(value, 7);
          done();
        });
      });
    });
    describe('type float', function() {
      var pv;
      before(function(done) {
        pv = new epics.Channel('NODE_EPICS_TEST:FLOAT');
        pv.connect(function(err) {
          done();
        });
      });
      it('should return 5.13', function(done) {
        pv.get(function(err, value) {
          assert.equal(value, 5.13);
          done();
        });
      });
    });
    ////TODO: Fix enums
    //describe('type enum', function() {
    //  var pv;
    //  before(function(done) {
    //    pv = new epics.Channel('NODE_EPICS_TEST:ENUM');
    //    pv.connect(function(err) {
    //      done();
    //    });
    //  });
    //  it('should return "Option 2"', function(done) {
    //    pv.get(function(err, value) {
    //      assert.equal(value, 'Option 2');
    //      done();
    //    });
    //  });
    //});
    describe('type char', function() {
      var pv;
      before(function(done) {
        pv = new epics.Channel('NODE_EPICS_TEST:CHAR');
        pv.connect(function(err) {
          done();
        });
      });
      it('should return 73', function(done) {
        pv.get(function(err, value) {
          assert.equal(value, 73);
          done();
        });
      });
    });
    describe('type int waveform', function() {
      var pv;
      before(function(done) {
        pv = new epics.Channel('NODE_EPICS_TEST:INT_WAVEFORM');
        pv.connect(function(err) {
          done();
        });
      });
      it('should return [5,4,3,2,1]', function(done) {
        pv.get(function(err, value) {
          assert.deepEqual(value, [5,4,3,2,1]);
          done();
        });
      });
    });
    describe('type float waveform', function() {
      var pv;
      before(function(done) {
        pv = new epics.Channel('NODE_EPICS_TEST:FLOAT_WAVEFORM');
        pv.connect(function(err) {
          done();
        });
      });
      it('should return [5.1,4.2,3.3]', function(done) {
        pv.get(function(err, value) {
          assert.deepEqual(value, [5.1,4.2,3.3]);
          done();
        });
      });
    });
    describe('type string waveform', function() {
      var pv;
      before(function(done) {
        pv = new epics.Channel('NODE_EPICS_TEST:STRING_WAVEFORM');
        pv.connect(function(err) {
          done();
        });
      });
      it('should return ["A39CharacterLongStringWhichIsTheMaximum", "another string", "& 1 more"]', function(done) {
        pv.get(function(err, value) {
          assert.deepEqual(value, ['A39CharacterLongStringWhichIsTheMaximum',
                    'another string',
                    '& 1 more']);
          done();
        });
      });
    });
  });
});
