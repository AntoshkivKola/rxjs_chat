// @ts-ignore
import React, {FC, useEffect, useState} from 'react';
import {LoginForm} from "./Components/LoginForm";
import {IGroup, IMessage, IUser} from "./types/user";
import {CurrentUser} from "./Components/CurrentUser";
import {ChatForm} from "./Components/ChatForm";
import {socket_manager} from "./socket_manager";
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

const initSomeSocketLogic = ({setCurrentUser, setUsers, setCurrentGroup, setMessages} : any) => {
    useEffect(() => {

        socket_manager.on('getUpdatedUser', (updatedUser) => {
            console.log('send updated user');
            setCurrentUser(updatedUser);
        })

        socket_manager.on('getUsers', (users) => {
            console.log('send users');
            setUsers(users);
        })

        socket_manager.on('getGroup', (group) => {
            console.log('send group', group);
            setCurrentGroup(group);
            if (group._id) {
                socket_manager.emit('getGroupMessages', {groupId: group._id});
                socket_manager.emit('getUserFromGroup', {groupId: group._id});
            }
        })


        socket_manager.on('getMassages', (messages) => {
            console.log('send massages', messages);
            setMessages(messages);
        })

    }, [])
}

export const App: FC = () => {
    const [currentUser, setCurrentUser] = useState<IUser>(initialUser);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [currentGroup, setCurrentGroup] = useState<IGroup>(initialGroup);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        socket_manager.emit('getMainGroup');
        console.log('group._id', {groupId : currentGroup._id})
    }, []);

    initSomeSocketLogic({setCurrentUser, setUsers, setCurrentGroup, setMessages});

    if (currentUser) {
        console.log('currentUser', currentUser);
    }

    return (
        <div>
            <h1>Hello World</h1>
            {isStandardUser(currentUser) && <LoginForm currentUser={currentUser} setCurrentUser={setCurrentUser} />}
            {currentUser && <CurrentUser currentUser={currentUser} />}
            <Chat messages={messages}  users={users}/>
            {!isStandardUser(currentUser) &&<ChatForm currentUser={currentUser}
                                                      currentGroup={currentGroup}
                                                     />}
        </div>
    );
}
