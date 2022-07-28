import {useState, useEffect} from "react";
import React from "react";
import {BehaviorSubject, fromEvent, Subscription, tap} from "rxjs";
import {map, pluck, switchMap} from "rxjs/operators";
import {ajax} from "rxjs/ajax";
import {IMessage, IUser} from "../../types/user";

const userSubject = new BehaviorSubject(null);


type TLoginForm = {
    currentUser: IUser;
    setCurrentUser: Function;
}

type TLogin = {
    login: string;
    password: string;
}

const useObservable = (observable: any, setter: any) => {
    console.log('useObservable');
    useEffect(() => {
        console.log('ese effect')
        const subscription = observable.subscribe((value: any) => {
            console.log('value: ', value);
            setter(value);
        });
        //return () => subscription.unsubscribe();
    }, []);
}

export const useLoginForm = ({currentUser, setCurrentUser}: TLoginForm) => {
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginChange = (e: any) => {
        setLogin(e.target.value);
    }

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
    }

    const makeRequest = ({login, password}: TLogin) => {
        setLoading(true);
        try {
            const login$ = userSubject.pipe(
                switchMap(() =>  ajax({
                    url: 'http://localhost:3333/login',
                    method: 'POST',
                    body: {login, password}
                }).pipe(
                    map(({response}) => response),
                ))

            )

            login$.subscribe((data: any) => {
                console.log(data);
                setCurrentUser(data);
                /*if (currentUser) {
                    if(currentUser.messages.length > 0) {
                        setMessages(
                            currentUser.messages.sort((a, b) => {
                                return new Date(a.data).getTime() - new Date(b.data).getTime();
                            })
                        );

                        console.log('messages',messages)
                    }
                }*/
            })
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        makeRequest({login, password});
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
