import {catchError, combineLatestWith, fromEvent, withLatestFrom} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {ajax} from "rxjs/ajax";
import {useEffect} from "react";
import { useSocket } from "../../socket_manager";

export const useLogin = (setCurrentUser: any) => {
    useEffect(() => {
        const loginInput = document.getElementById('login-input') as HTMLInputElement;
        const passwordInput = document.getElementById('password-input') as HTMLInputElement;
        const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
        const socketMan = useSocket();

        const login$ = fromEvent(loginInput, 'input').pipe(
            map((e: any) => e.target.value)
        );
        const password$ = fromEvent(passwordInput, 'input').pipe(
            map((e: any) => e.target.value),
            combineLatestWith(login$),
        );
        const subscription = fromEvent(loginBtn, 'click').pipe(
            withLatestFrom(password$),
            switchMap(([, [password, login]]) => {
                return ajax.post('http://localhost:3333/login', {login, password});
            }),
            catchError((err) => {
                console.log('CATCH err', err);
                return ''
            }),
        ).subscribe((res: any) => {
            if(res.status === 200) {
                setCurrentUser(res.response);
                socketMan.send('join', res.response);
                socketMan.send('getUserGroups', res.response._id)
            }
        })

        return () => {
            subscription.unsubscribe();
        }
    }, []);
}
