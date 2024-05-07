const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});
const PORT = process.env.PORT || 4000;

const MAX_ROOM_SIZE = 10;
const rooms = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('createRoom', () => {
        const roomId = generateRoomId();
        socket.join(roomId);
        rooms[roomId] = [socket.id];
        sendRoomInfo(roomId);
        sendAlertToClient(socket.id, 'success', 'Room Created', `You created room ${roomId}`);
    });

    socket.on('joinRoom', (roomId) => {
        if (rooms[roomId] && rooms[roomId].length < MAX_ROOM_SIZE) {
            socket.join(roomId);
            rooms[roomId].push(socket.id);
            sendRoomInfo(roomId);
            sendAlertToClient(socket.id, 'success', 'Joined Room', `You joined room ${roomId}`);
        } else {
            sendAlertToClient(socket.id, 'warning', 'Room Full or Invalid', 'Sorry, the room is full or invalid.');
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Remove disconnected user from rooms
        for (const roomId in rooms) {
            const index = rooms[roomId].indexOf(socket.id);
            if (index !== -1) {
                rooms[roomId].splice(index, 1);
                sendRoomInfo(roomId);
                break;
            }
        }
    });

    const sendRoomInfo = (roomId) => {
        io.to(roomId).emit('roomInfo', {
            id: roomId,
            players: rooms[roomId] || [],
            isFull: rooms[roomId] && rooms[roomId].length >= MAX_ROOM_SIZE
        });
    };

    const generateRoomId = () => {
        // Generate a random 6-character alphanumeric string as room ID
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let roomId = '';
        for (let i = 0; i < 6; i++) {
            roomId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return roomId;
    };

    const sendAlertToClient = (clientId, icon, title, text) => {
        io.to(clientId).emit('alert', { icon, title, text });
    };
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
