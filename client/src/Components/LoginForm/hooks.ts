import {useState, useEffect} from "react";
import React from "react";
import {fromEvent, Subscription} from "rxjs";
import {map, pluck, switchMap} from "rxjs/operators";
import {ajax} from "rxjs/ajax";

interface IMessage {
    text: string;
    data: string;
}

interface IUser {
    name: string;
    color: string;
    login: string;
    password: string;
    messages: IMessage[];
}

type LoginFormProps = {
    login: string;
    password: string;
}


export const useLoginForm = () => {
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const [user, setUser] = useState<IUser>();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginChange = (e: any) => {
        setLogin(e.target.value);
    }

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
    }



    let loginSubscription: Subscription;

    const makeRequest = async ({login, password}: LoginFormProps) => {
        setLoading(true);
        try {
            const login$ = ajax({

                url: 'http://localhost:3333/login',
                method: 'POST',
                crossDomain: true,
                withCredentials: false,
                body: {login, password}
            }).pipe(
                pluck('response')
            );

            const r = await fetch('https://reqres.in/api/products/3', {
                method: 'GET',
            });

            console.log('r', r)

            const r2 = await fetch('http://localhost:3333/', {
                method: 'GET',
            });

            console.log('r2', r2)



            loginSubscription = login$.subscribe((data: any) => {
                console.log(data);
                setUser(data);
                if (user) {
                    if(user.messages.length > 0) {
                        setMessages(
                            user.messages.sort((a, b) => {
                                return new Date(a.data).getTime() - new Date(b.data).getTime();
                            })
                        );

                        console.log('messages',messages)
                    }
                }
            });

            //await login(email, password);
        } catch (error: any) {
            setError(error.message);
        } finally {
            loginSubscription.unsubscribe();
        }
        setLoading(false);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await makeRequest({login, password});
        console.log('e', e)
        console.log('states', login, password)
    }


    return {
        error,
        setError,
        isLoading,
        handleSubmit,
        handleLoginChange,
        handlePasswordChange,
        login,
        password,
    }
}
