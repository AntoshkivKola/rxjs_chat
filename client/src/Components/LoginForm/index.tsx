import React, {FC} from 'react';
import {useLogin} from "./hooks";
import {IUser} from "../../types/user";

type LoginFormProps = {
    currentUser: IUser;
    setCurrentUser: Function;
}

export const LoginForm: FC<LoginFormProps> = (props: LoginFormProps) => {
    const {setCurrentUser} = props;

    useLogin(setCurrentUser);

    return (
        <div>
            <h1>Login</h1>
            <div>
                <input placeholder="Login" type="text" id="login-input"  />
                <input placeholder="Password" type="password" id="password-input" />
                <button id="login-btn" type="submit">Login</button>
            </div>
        </div>
    );
}
