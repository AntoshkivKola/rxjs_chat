// @ts-ignore
import React, {FC, useEffect, useState} from 'react';
import {LoginForm} from "./Components/LoginForm";
import {IGroup, IMessage, IUser} from "./types/user";
import {CurrentUser} from "./Components/CurrentUser";
import {ChatForm} from "./Components/ChatForm";
import {useSocket} from "./socket_manager";
import {Chat} from "./Components/Chat";
import styles from './App.module.scss';
import {GroupsList} from "./Components/GroupsList";
import {CurrentGroup} from "./Components/CurrentGroup";
import {Logout} from "./Components/Logout";

const initialUser = {
    _id: '',
    name: 'Test',
    color: 'black',
    login: '',
    password: '',
    messages: [],
}

export const initialGroup = {
    name: '',
    members: [],
    _id: '',
    owner_id: '-',
}

const isStandardUser = (user: IUser) => {
    return user.name === 'Test';
}

export const App: FC = () => {
    const [currentUser, setCurrentUser] = useState<IUser>(initialUser);
    const [usersFromCurrentGroup, setUsersFromCurrentGroup] = useState<IUser[]>([]);
    const [allUsers, setAllUsers] = useState<IUser[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [currentGroup, setCurrentGroup] = useState<IGroup>(initialGroup);
    const [groups, setGroups] = useState<IGroup[]>([]);

    useEffect(() => {
        const socketMan = useSocket();
        socketMan.send('getMainGroup', null);

        socketMan.on('takeGroup').subscribe(
            (group: IGroup) => {
                console.log('getGroup', group);
                setCurrentGroup(group);
                socketMan.send('getGroupMessages', {groupId: group._id});
                socketMan.send('getUserFromGroup', {groupId: group._id});
                socketMan.send('getAllUsers', null);
            }
        );

        socketMan.on('takeUsersFromGroup').subscribe(setUsersFromCurrentGroup);
        socketMan.on('takeAllUsers').subscribe(setAllUsers);
        socketMan.on('getMessages').subscribe(setMessages);
        socketMan.on('takeGroups').subscribe(setGroups);

        return () => { socketMan.disconnect() }
    }, []);

    if (currentUser) {
        console.log('currentUser', currentUser);
    }

    return (

        <div className={styles.appContainer}>
            <div className={styles.groupsContainer}>
                <GroupsList groups={groups}
                            setCurrentGroup={setCurrentGroup}
                            isLogined={!isStandardUser(currentUser)}
                            currentUser={currentUser}/>
            </div>
            <div className={styles.chatContainer}>
                <div className={styles.messagesContainer}>
                    <Chat messages={messages}  users={allUsers} isLogined={!isStandardUser(currentUser)}/>
                </div>
                <div className={styles.chatFormContainer}>
                {{/*!isStandardUser(currentUser)*/} && <ChatForm currentUser={currentUser}
                                                           currentGroup={currentGroup} />}
                </div>
            </div>
            <div className={styles.userContainer}>
                {isStandardUser(currentUser) ?
                    <LoginForm currentUser={currentUser} setCurrentUser={setCurrentUser} /> :
                    <Logout setCurrentUser={setCurrentUser} initialUser={initialUser}/>}


                {currentUser && <CurrentUser currentUser={currentUser} />}
                {(!isStandardUser(currentUser) && currentGroup) && <CurrentGroup currentGroup={currentGroup}
                                               users={usersFromCurrentGroup}
                                               currentUser={currentUser}
                                              />}
            </div>



        </div>
    );
}
