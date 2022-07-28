import {io} from "socket.io-client";

export const socket_manager = io('http://localhost:3333');
socket_manager.on('connect', () => {
    console.log('connected to server');

    socket_manager.on('disconnect', () => {
        console.log('disconnected from server');
    });
});
