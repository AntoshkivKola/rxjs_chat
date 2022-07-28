import React, {FC} from "react";
import { IMessage, IUser } from "../../types/user";


const useMessages = (messages: IMessage[], users: IUser[]) => {
    return messages.sort((a: IMessage, b: IMessage) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }).map((message: IMessage, index: number) => {

        return {
            ...message,
            color: users.find((user: IUser) => user._id === message.author_id)?.color || 'black',
        }
    });
}

export const Chat: FC<any> = (props: any) => {
    const {messages, users} = props;
    console.log('users',users);

    return (
        <div>
            <ul>
                {useMessages(messages, users).map((message: any, index: number) => (
                        <li key={index}>
                            <div className="userColor" style={{backgroundColor: message.color}}></div>
                            <div className="message" style={{backgroundColor: message.color}}>
                                {message.text}
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}
