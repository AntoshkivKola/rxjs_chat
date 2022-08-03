import React, {FC} from "react";
import styles from "./Logout.module.scss";

export const Logout: FC<any> = (props: any) => {
    const {setCurrentUser,initialUser } = props;

    const logout = () => {
        setCurrentUser(initialUser);
    }

    return (
        <div className={styles.logoutContainer}>
            <button className={styles.logoutButton} onClick={logout}>Logout</button>
        </div>
    )
}
