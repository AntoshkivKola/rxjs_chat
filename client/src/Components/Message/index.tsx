import React, {FC} from "react";
import styles from "./Message.module.scss";
// @ts-ignore
import  rgba  from 'rgba-convert';

export const Message: FC<any> = (props: any) => {
    const {message, user} = props;

    return (
        <li className={styles.messageContainer}>
            <div className={styles.messageItem} style={{
                marginBottom: message.isAuthorNeeded ? '10px' : '0px',
            }}>
                {<div  className={styles.messageAuthor} style={{
                    backgroundColor: message.color,
                    opacity: message.isAuthorNeeded ? 1 : 0,
                }}/>}
                <div className={styles.messageText} style={{backgroundColor:  rgba.css(`${message.color}80`)}}>
                    {message.text}
                </div>
            </div>
        </li>
    );
}
