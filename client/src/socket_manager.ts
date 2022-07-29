import {io} from "socket.io-client";
import {fromEvent, Observable} from "rxjs";

const socket_manager = io('http://localhost:3333');
socket_manager.on('connect', () => {
    console.log('connected to server');

    socket_manager.on('disconnect', () => {
        console.log('disconnected from server');
    });
});

export const useSocket = () => {
    const send = (event: string, data: any) => {
        socket_manager.emit(event, data);
    }

    const on = (event: string): Observable<any> => {
        return fromEvent(socket_manager, event);
    }

    const disconnect = () => socket_manager.disconnect();

    return {
        send,
        on,
        disconnect
    }
}

