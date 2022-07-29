import React, {FC} from 'react';
import {useLogin} from "./hooks";
import {IUser} from "../../types/user";
import styles from './LoginForm.module.scss';

type LoginFormProps = {
    currentUser: IUser;
    setCurrentUser: Function;
}

export const LoginForm: FC<LoginFormProps> = (props: LoginFormProps) => {
    const {setCurrentUser} = props;

    useLogin(setCurrentUser);

    return (
        <div className={styles.loginContainer}>
            <h1 className={styles.loginTitle}>Login</h1>
            <div className={styles.loginForm}>
                <input className={styles.loginInput} placeholder="Login" type="text" id="login-input"  />
                <input className={styles.passwordInput} placeholder="Password" type="password" id="password-input" />
                <button className={styles.submitButton} id="login-btn" type="submit">Login</button>
            </div>
        </div>
    );
}
