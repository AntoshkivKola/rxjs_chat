// @ts-ignore
import React, {FC, useEffect, useState} from 'react';
import {LoginForm} from "./Components/LoginForm";
import {IGroup, IMessage, IUser} from "./types/user";
import {CurrentUser} from "./Components/CurrentUser";
import {ChatForm} from "./Components/ChatForm";
import {useSocket} from "./socket_manager";
import {Chat} from "./Components/Chat";

const initialUser = {
    _id: '',
    name: 'Test',
    color: 'black',
    login: '',
    password: '',
    messages: [],
}

const initialGroup = {
    name: '',
    members: [],
    _id: ''
}

const isStandardUser = (user: IUser) => {
    return user.name === 'Test';
}

export const App: FC = () => {
    const [currentUser, setCurrentUser] = useState<IUser>(initialUser);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [currentGroup, setCurrentGroup] = useState<IGroup>(initialGroup);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        const socketMan = useSocket();
        socketMan.send('getMainGroup', null);

        socketMan.on('getGroup').subscribe(
            (group: IGroup) => {
                console.log('getGroup', group);
                setCurrentGroup(group);
                socketMan.send('getGroupMessages', {groupId: group._id});
                socketMan.send('getUserFromGroup', {groupId: group._id});
            }
        );

        socketMan.on('getUsers').subscribe(setUsers);
        socketMan.on('getMessages').subscribe(setMessages);

        return () => { socketMan.disconnect() }
    }, []);

    if (currentUser) {
        console.log('currentUser', currentUser);
    }

    return (
        <div>
            <h1>Hello World</h1>
            {isStandardUser(currentUser) && <LoginForm currentUser={currentUser} setCurrentUser={setCurrentUser} />}
            {currentUser && <CurrentUser currentUser={currentUser} />}
            <Chat messages={messages}  users={users} />
            {!isStandardUser(currentUser) && <ChatForm currentUser={currentUser}
                                                      currentGroup={currentGroup} />}
        </div>
    );
}
