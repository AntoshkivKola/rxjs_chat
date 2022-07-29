import React, {FC} from "react";
import {useChatForm} from "./hook";
import styles from "./ChatForm.module.scss";

export const ChatForm: FC<any> = (props: any) => {
    const {currentUser, currentGroup} = props;

    useChatForm(currentUser, currentGroup);

    return (
        <div className={styles.formContainer}>
            <input className={styles.chatMessage} id="message" type="text" placeholder="message..."/>
            <button className={styles.buttonSendMessage} id="sendMessage" type="submit">Send</button>
        </div>
    );
}
