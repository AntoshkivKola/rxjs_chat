import React, {FC, useState} from "react";
import {socket_manager} from "../../socket_manager";

export const ChatForm: FC<any> = (props: any) => {
    const {currentUser, currentGroup, updateMessages} = props;

    const [message, setMessage] = useState("");

    const handleSubmit = async (e: any) => {
        socket_manager.emit('chat message', {message, author: currentUser, group: currentGroup});
        setMessage("");
    }

    const handleMessageChange = (e: any) => {
        setMessage(e.target.value);
    }

    return (
        <div>
            <input onChange={handleMessageChange} value={message} type="text" placeholder="message..."/>
            <button onClick={handleSubmit} type="submit">Send</button>
        </div>
    );
}
