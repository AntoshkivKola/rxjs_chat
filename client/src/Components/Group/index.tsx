import React, {FC, useEffect} from "react";
import { fromEvent } from "rxjs";
import {useSocket} from "../../socket_manager";
import { IGroup } from "../../types/user";
import styles from './Group.module.scss';

const useGroup = (group: IGroup, groupId: string, setCurrentGroup:any) => {
    useEffect(() => {
        console.log('useGroup');
        const groupElement = document.getElementById(groupId) as HTMLButtonElement;
        const socketMan = useSocket();

        const subscription = fromEvent(groupElement, 'click').subscribe(() => {
            console.log('groupElement click', group);
            setCurrentGroup(group);
            socketMan.send('getGroupMessages', {groupId: group._id});
            socketMan.send('getUserFromGroup', {groupId: group._id});
        });

        return () => { subscription.unsubscribe() }
    }, [])
}

export const Group: FC<any> = (props: any) => {
    const { group = {}, setCurrentGroup } = props;
    const { name = '' } = group;
    const groupId = `group-${group._id}`;

    useGroup(group, groupId, setCurrentGroup);


    return (
        <li className={styles.groupContainer}>
            <div className={styles.groupItem} id={groupId}>
                <h3 className={styles.groupName}>
                    {name}
                </h3>
            </div>
        </li>
    )
}
