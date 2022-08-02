import React, {FC, useEffect} from "react";
import {fromEvent, Subscription} from "rxjs";
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
    }, [group])
}

const useDeleteGroup = (deleteGroupButtonId: string ,group: IGroup) => {
    useEffect(() => {
        const socketMan = useSocket();
        const deleteGroupButton = document.getElementById(deleteGroupButtonId) as HTMLButtonElement;

        let subscription: Subscription;
        if(deleteGroupButton) {
            console.log('deleteGroupButton');
            subscription = fromEvent(deleteGroupButton, 'click').subscribe(() => {
                console.log('deleteGroupButton click', group._id);

                socketMan.send('deleteGroup', {group});
            })
        }


        return () => { subscription.unsubscribe() }
    }, [])
}

export const Group: FC<any> = (props: any) => {
    const { group = {}, setCurrentGroup, keyId } = props;
    const { name = '' } = group;
    const groupId = `group-${group._id}`;
    const deleteGroupButtonId = `delete-group-button-${group._id}`;

    useGroup(group, groupId, setCurrentGroup);
    useDeleteGroup(deleteGroupButtonId, group);

    return (
        <li className={styles.groupContainer} key={keyId}>
            <div className={styles.groupItemContainer}>
                <div  id={groupId} className={styles.groupItem}>
                    <h3 className={styles.groupName}>
                        {name}
                    </h3>
                </div>

                <button className={styles.deleteGroupButton} id={deleteGroupButtonId}>Delete</button>
            </div>
        </li>
    )
}
