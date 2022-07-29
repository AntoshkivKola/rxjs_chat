import {combineLatestWith, fromEvent, withLatestFrom} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {ajax} from "rxjs/ajax";
import {useEffect} from "react";

export const useLogin = (setCurrentUser: any) => {
    useEffect(() => {
        const loginInput = document.getElementById('login-input') as HTMLInputElement;
        const passwordInput = document.getElementById('password-input') as HTMLInputElement;
        const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;

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
            })
        ).subscribe((res: any) => {
            setCurrentUser(res.response);
        },)

        return () => {
            subscription.unsubscribe();
        }
    }, []);
}
