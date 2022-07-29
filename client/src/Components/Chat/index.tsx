import React, {FC, useEffect, useRef} from "react";
import { IMessage, IUser } from "../../types/user";
import {Message} from "../Message";
import styles from "./Chat.module.scss";

const useMessages = (messages: IMessage[], users: IUser[]) => {
    return messages.sort((a: IMessage, b: IMessage) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }).map((message: IMessage, index) => {
        return {
            ...message,
            isAuthorNeeded: index === messages.length-1 ?
                true :
                message.author_id !== messages[index+1 === messages.length ? index : index+1].author_id,
            color: users.find((user: IUser) => user._id === message.author_id)?.color || 'black',
        }
    });
}

export const Chat: FC<any> = (props: any) => {
    const {messages, users} = props;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (messagesEndRef as React.RefObject<HTMLDivElement> && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    useEffect(scrollToBottom, [messages]);

    const pm = [{
        _id: '',
        text: 'test',
        author_id: 'raewra',
        date: '',
        isAuthorNeeded: true,
        color: '#ff0000',
    }]
    return (
        <div className={styles.chatContainer}>
            <ul  className={styles.messagesList}>
                {useMessages(messages, users).map((message: any, index: number) => (
                    <Message key={index} message={message} />

                    ))
                }
                <div ref={messagesEndRef} />
                {/*{pm.map((message: any, index: number) => (
                    <Message key={index} message={message} />

                ))}*/}
            </ul>
        </div>
    );
}
