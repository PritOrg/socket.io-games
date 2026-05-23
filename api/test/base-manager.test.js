process.env.NODE_ENV = 'test';
const { expect } = require('chai');

// Mock socket.io server and client for testing
describe('BaseManager Shared Functionality', function () {
  let io;
  let baseManager;

  beforeEach(() => {
    // Create a mock io object
    io = {
      to: (_roomId) => ({
        emit: (_event, _data) => {},
      }),
    };

    // Import BaseManager
    const BaseManager = require('../game-logic/BaseManager');
    baseManager = new BaseManager(io);
  });

  describe('sanitizeRoomId', () => {
    it('should convert lowercase roomId to uppercase', () => {
      expect(baseManager.sanitizeRoomId('abc123')).to.equal('ABC123');
    });

    it('should return null for invalid input', () => {
      expect(baseManager.sanitizeRoomId(null)).to.be.null;
      expect(baseManager.sanitizeRoomId(undefined)).to.be.null;
      expect(baseManager.sanitizeRoomId('')).to.be.null;
    });
  });

  describe('validatePlayerName', () => {
    it('should validate valid player names', () => {
      expect(baseManager.validatePlayerName('Alice')).to.be.true;
      expect(baseManager.validatePlayerName('Bob')).to.be.true;
      expect(baseManager.validatePlayerName('A')).to.be.true; // minimum length
      expect(baseManager.validatePlayerName('A'.repeat(20))).to.be.true; // maximum length
    });

    it('should reject invalid player names', () => {
      expect(baseManager.validatePlayerName('')).to.be.false; // too short
      expect(baseManager.validatePlayerName('A'.repeat(21))).to.be.false; // too long
      expect(baseManager.validatePlayerName(null)).to.be.false;
      expect(baseManager.validatePlayerName(undefined)).to.be.false;
      expect(baseManager.validatePlayerName(123)).to.be.false; // not string
    });
  });

  describe('sanitizePlayerName', () => {
    it('should trim whitespace from player names', () => {
      expect(baseManager.sanitizePlayerName('  Alice  ')).to.equal('Alice');
      expect(baseManager.sanitizePlayerName('\tBob\n')).to.equal('Bob');
    });

    it('should return Anonymous for invalid names', () => {
      expect(baseManager.sanitizePlayerName('')).to.equal('Anonymous');
      expect(baseManager.sanitizePlayerName(null)).to.equal('Anonymous');
      expect(baseManager.sanitizePlayerName(undefined)).to.equal('Anonymous');
    });
  });

  describe('clearTimer', () => {
    it('should clear existing timer', () => {
      const callback = () => {};
      const timerId = setTimeout(callback, 1000);
      baseManager.timers.set('test', timerId);

      baseManager.clearTimer('test');

      expect(baseManager.timers.has('test')).to.be.false;
    });

    it('should do nothing for non-existent timer', () => {
      expect(() => baseManager.clearTimer('non-existent')).to.not.throw();
    });
  });

  describe('registerEmptyTimer', () => {
    it('should register a timer', () => {
      const roomId = 'TEST123';
      const callback = () => {};

      // Add a room to test
      baseManager.rooms.set(roomId, { id: roomId });

      baseManager.registerEmptyTimer(roomId, callback);

      // Timer should be registered
      expect(baseManager.timers.has(`empty_${roomId}`)).to.be.true;
    });

    it('should clear existing timer before registering new one', () => {
      const roomId = 'TEST123';
      const callback1 = () => {};
      const callback2 = () => {};

      // Add a room to test
      baseManager.rooms.set(roomId, { id: roomId });

      // Register first timer
      baseManager.registerEmptyTimer(roomId, callback1);
      const firstTimer = baseManager.timers.get(`empty_${roomId}`);

      // Register second timer (should clear first)
      baseManager.registerEmptyTimer(roomId, callback2);
      const secondTimer = baseManager.timers.get(`empty_${roomId}`);

      // Timers should be different (first was cleared)
      expect(firstTimer).to.not.equal(secondTimer);
      // Only one timer should be registered
      expect(baseManager.timers.has(`empty_${roomId}`)).to.be.true;
    });
  });
});
