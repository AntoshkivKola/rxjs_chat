import React, {FC, useState} from 'react';
import {fromEvent} from "rxjs";
import {map, switchMap, pluck} from "rxjs/operators";
import {ajax} from "rxjs/ajax";
import {useLoginForm} from "./hooks";
import {IUser} from "../../types/user";

type LoginFormProps = {
    currentUser: IUser;
    setCurrentUser: Function;
}

export const LoginForm: FC<LoginFormProps> = (props: LoginFormProps) => {
    const {currentUser, setCurrentUser} = props;
    const {
        login,
        password,
        handleSubmit,
        handleLoginChange,
        handlePasswordChange,
    } = useLoginForm({currentUser, setCurrentUser});

    return (
        <div>
            <h1>Login</h1>
            <div>
                <input placeholder="Login" type="text" id="login-input"  value={login} onChange={handleLoginChange} />
                <input placeholder="Password" type="password" id="password-input"  value={password} onChange={handlePasswordChange} />
                <button type="submit" onClick={handleSubmit}>Login</button>
            </div>
        </div>
    );
}
