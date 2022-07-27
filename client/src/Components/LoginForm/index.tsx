import React, {FC, useState} from 'react';
import {fromEvent} from "rxjs";
import {map, switchMap, pluck} from "rxjs/operators";
import {ajax} from "rxjs/ajax";
import {useLoginForm} from "./hooks";

export const LoginForm: FC = () => {
    const {
        login,
        password,
        handleSubmit,
        handleLoginChange,
        handlePasswordChange,
    } = useLoginForm();

    return (
        <div>
            <h1>Login</h1>
            <div>
                <input type="text" id="login-input"  value={login} onChange={handleLoginChange} />
                <input type="password" id="password-input"  value={password} onChange={handlePasswordChange} />
                <button type="button" onClick={handleSubmit}>Login</button>
            </div>
        </div>
    );
}
