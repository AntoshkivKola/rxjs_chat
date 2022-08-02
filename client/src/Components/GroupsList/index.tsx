import React, {FC, useEffect} from "react";
import {fromEvent, Subscription} from "rxjs";
import {Group} from "../Group";
import styles from "./GroupsList.module.scss";
import {useSocket} from "../../socket_manager";
import {IUser} from "../../types/user";

const useCreateGroup = (isAddInputNeed: boolean, currentUser: IUser) => {
    useEffect(() => {
        const socketMan = useSocket();
        const createGroupButton = document.getElementById('create-group-button') as HTMLButtonElement;
        const groupNameInput = document.getElementById('create-group-input') as HTMLInputElement;

        let subscription: Subscription;
        if (createGroupButton && groupNameInput) {
            subscription = fromEvent(createGroupButton, 'click').subscribe(() => {
                console.log('create group', groupNameInput.value);
                socketMan.send('createGroup', {groupName: groupNameInput.value, owner_id: currentUser._id});
                groupNameInput.value = '';
            });
        }

        return () => {
            if (subscription) subscription.unsubscribe()
        }
    }, [isAddInputNeed])
}

export const GroupsList: FC<any> = (props: any) => {
    const { groups = [], setCurrentGroup, isLogined, currentUser } = props;
    const [isAddInputNeed, setIsAddInputNeed] = React.useState(false);

    const handleAddGroup = () => {
        setIsAddInputNeed((prevState: boolean) => !prevState);
    }

    useCreateGroup(isAddInputNeed, currentUser);

    return (
        <div className={styles.groupsListContainer}>
            <h1 className={styles.groupsListHeader}>
                GroupsList
            </h1>
            {isLogined && <>
                 <div className={styles.addGroupContainer}>
                    <h2 className={styles.addGroupTitle}>Add new group</h2>
                    <button onClick={handleAddGroup} className={styles.showInputButton}>{isAddInputNeed ? 'Close' : '+'}</button>
                    {isAddInputNeed && <input id="create-group-input" type="text" placeholder="New group name" className={styles.inputNewGroupName}/>}
                    {isAddInputNeed && <button id="create-group-button" className={styles.addGroupButton}>Create new group</button>}
                </div>
                <ul className={styles.groupsList}>
                    {groups.map((group: any) => (
                        <Group  keyId={group._id} group={group} setCurrentGroup={setCurrentGroup} />
                    ))}
                </ul>
            </>}
        </div>

    )
}
