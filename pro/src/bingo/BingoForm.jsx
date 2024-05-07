import { Button, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';

const socket = io('http://localhost:4000'); // Replace with your server URL

const BingoForm = () => {
    const [roomId, setRoomId] = useState('');
    const [roomInfo, setRoomInfo] = useState({});

    useEffect(() => {
        // Event listener for room updates
        socket.on('roomInfo', (data) => {
            setRoomInfo(data);
        });

        return () => {
            // Clean up event listener on unmount
            socket.off('roomInfo');
        };
    }, []);

    const handleCreateRoom = () => {
        socket.emit('createRoom');
    };

    const handleJoinRoom = (roomId) => {
        socket.emit('joinRoom', roomId);
    };

    // Function to display SweetAlert
    const showAlert = (icon, title, text) => {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            showConfirmButton: false,
            timer: 3000,
        });
    };

    useEffect(() => {
        // Event listener for alerts
        socket.on('alert', (data) => {
            showAlert(data.icon, data.title, data.text);
        });

        return () => {
            // Clean up event listener on unmount
            socket.off('alert');
        };
    }, []);

    return (
        <div>
            {/* Render room info */}
            <Typography variant="h5">Room ID: {roomInfo.id}</Typography>
            <Typography variant="body1">Players: {roomInfo.players && roomInfo.players.join(', ')}</Typography>
            <Typography variant="body1">Room is Full: {roomInfo.isFull ? 'Yes' : 'No'}</Typography>

            {/* Buttons to create and join room */}
            <Button variant="contained" onClick={handleCreateRoom}>Create Room</Button>
            <TextField label="Enter Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            <Button variant="contained" onClick={handleJoinRoom}>Join Room</Button>
        </div>
    );
};

export default BingoForm;
