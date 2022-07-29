import React, {FC, useEffect} from "react";
import {useSocket} from "../../socket_manager";
import {fromEvent, tap, withLatestFrom} from "rxjs";
import {map} from "rxjs/operators";

export const ChatForm: FC<any> = (props: any) => {
    const {currentUser, currentGroup} = props;

    useEffect(() => {
        const sendBtn = document.getElementById('sendMessage') as HTMLButtonElement;
        const input = document.getElementById('message') as HTMLInputElement;
        const {send} = useSocket();

        const updateMessage = fromEvent(input, 'input').pipe(
            map((e: any) => e.target.value)
        )
        fromEvent(sendBtn, 'click').pipe(
            withLatestFrom(updateMessage),
            tap(([, message]) => {
                send('chat message', {message, author: currentUser, group: currentGroup});
                input.value = '';
            })
        ).subscribe();
    }, [])

    return (
        <div>
            <input id="message" type="text" placeholder="message..."/>
            <button id="sendMessage" type="submit">Send</button>
        </div>
    );
}
