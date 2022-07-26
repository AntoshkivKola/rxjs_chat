import { ajax } from 'rxjs/ajax';
import {map, pluck, switchMap} from 'rxjs/operators';
import {fromEvent} from "rxjs";
import {io} from "socket.io-client";

const loginForm = document.querySelector('#login-form') as HTMLFormElement;
const loginInput = document.querySelector('#login-input') as HTMLInputElement;
const passwordInput = document.querySelector('#password-input') as HTMLInputElement;

const userLoginElement = document.querySelector('.user-login') as HTMLDivElement;

const login$ = fromEvent(loginForm, 'submit').pipe(
        map(e => {
            e.preventDefault();
            return {
                login: loginInput.value,
                password: passwordInput.value
            }
        }),
        switchMap(({login, password}) => ajax({
            url: 'http://localhost:3333/login',
            method: 'POST',
            body: {login, password}
        }).pipe(
            pluck('response')
        ))
    );

export interface IMessage {
    text: string;
    data: string;
}

export interface IUser {
    name: string;
    color: string;
    login: string;
    password: string;
    messages: IMessage[];
}

let user: IUser;

login$.subscribe((data: any) => {
    console.log(data);
    user = data;
    if (user) {
        userLoginElement.innerHTML = `${user.name}`;
        userLoginElement.style.backgroundColor = user.color;
    }
});


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
    )
)

const subscribe = users.subscribe(
    (res: any) => {
        rootDiv.innerHTML = `res.text count=${res.count}`;
        console.log(res)
    },
    err => console.error(err)
);
