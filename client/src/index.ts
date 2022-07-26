import { ajax } from 'rxjs/ajax';
import {map, switchMap} from 'rxjs/operators';
import {fromEvent} from "rxjs";
import {io} from "socket.io-client";

const socket = io('http://localhost:3333');

const form = document.getElementById('form') as HTMLFormElement;
const input = document.getElementById('input') as HTMLInputElement;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});


const rootDiv = document.getElementById('root') as HTMLDivElement;
const butn = document.getElementById('makeRequest') as HTMLButtonElement;

const helloWorld = `http://localhost:3333/`;

const users = fromEvent(butn, 'click').pipe(
    switchMap(
        () =>  ajax(helloWorld).pipe(
            map(res => res.response)
    )

    ))

const subscribe = users.subscribe(
    (res: any) => {
        rootDiv.innerHTML = `res.text count=${res.count}`;
        console.log(res)
    },
    err => console.error(err)
);
