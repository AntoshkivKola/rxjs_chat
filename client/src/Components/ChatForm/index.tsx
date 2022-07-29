import React, {FC} from "react";
import {useChatForm} from "./hook";

export const ChatForm: FC<any> = (props: any) => {
    const {currentUser, currentGroup} = props;

    useChatForm(currentUser, currentGroup);

    return (
        <div>
            <input id="message" type="text" placeholder="message..."/>
            <button id="sendMessage" type="submit">Send</button>
        </div>
    );
}
