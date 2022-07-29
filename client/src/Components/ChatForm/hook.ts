import {useSocket} from "../../socket_manager";
import {fromEvent, tap, withLatestFrom} from "rxjs";
import {map} from "rxjs/operators";
import {IGroup, IUser } from "../../types/user";
import {useEffect} from "react";

export const useChatForm = (currentUser: IUser, currentGroup: IGroup) => {
    useEffect(() => {
        const sendBtn = document.getElementById('sendMessage') as HTMLButtonElement;
        const input = document.getElementById('message') as HTMLInputElement;
        const {send} = useSocket();

        const updateMessage = fromEvent(input, 'input').pipe(
            map((e: any) => e.target.value)
        )
        const subscription = fromEvent(sendBtn, 'click').pipe(
            withLatestFrom(updateMessage),
            tap(([, message]) => {
                send('chat message', {message, author: currentUser, group: currentGroup});
                input.value = '';
            })
        ).subscribe();

        return () => {
            subscription.unsubscribe();
        }
    })

}
