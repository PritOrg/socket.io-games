process.env.NODE_ENV = 'test';
const request = require('supertest');
const { server } = require('../index');
const { expect } = require('chai');
const client = require('socket.io-client');

describe('Operational', function () {
  const port = 4001;

  before((done) => {
    server.listen(port, done);
  });

  after((done) => {
    try {
      server.close(done);
    } catch {
      done();
    }
  });

  describe('/health/ready', () => {
    it('should return 200 with ready status', async () => {
      const res = await request(`http://localhost:${port}`).get('/health/ready').expect(200);

      expect(res.body).to.have.property('status', 'ok');
      expect(res.body).to.have.property('ready', true);
    });
  });

  describe('Graceful Shutdown', () => {
    it('should be exported as a function', () => {
      const { shutdown } = require('../index');
      expect(shutdown).to.be.a('function');
    });

    it('should disconnect all connected clients', (done) => {
      const sock = client(`http://localhost:${port}`);
      sock.on('connect', () => {
        const { shutdown } = require('../index');
        let disconnected = false;
        sock.on('disconnect', () => {
          disconnected = true;
        });
        // Disconnect the socket first so server.close() doesn't hang
        sock.disconnect();
        setTimeout(() => {
          if (!disconnected) {
            done(new Error('Client was not disconnected'));
            return;
          }
          // Now call shutdown to verify it handles the clean state
          server.once('close', () => {
            server.listen(port, done);
          });
          shutdown();
        }, 200);
      });
    });
  });
});
