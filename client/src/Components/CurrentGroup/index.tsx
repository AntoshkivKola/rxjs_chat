import React, {FC, useEffect} from "react";
import styles from "./CurrentGroup.module.scss";
import {IGroup, IUser} from "../../types/user";
import {initialGroup} from "../../App";
import {useSocket} from "../../socket_manager";
import {fromEvent, Subscription} from "rxjs";

const useAddMember = (user: IUser, currentGroup: IGroup, currentUser: IUser) => {
    useEffect(() => {
        const socketMan = useSocket();
        const addMemberInput = document.getElementById('add-member-input') as HTMLInputElement;
        const addMemberButton = document.getElementById('add-member-button') as HTMLButtonElement;

        let subscription: Subscription;
        if (addMemberInput && addMemberButton) {
            subscription = fromEvent(addMemberButton, 'click').subscribe(() => {
                socketMan.send('addUserToGroup', {groupId: currentGroup._id, userId: user._id, currentUserId: currentUser._id});
                addMemberInput.value = '';
            });
        }

        return () => { if (subscription) subscription.unsubscribe() }
    }, [])
}

const useDeleteMember = (currentGroup: IGroup, currentUser: IUser) => {
    useEffect(() => {
        const socketMan = useSocket();
        const membersList = document.getElementById('members-list') as HTMLUListElement;

        let deleteButtons: HTMLButtonElement[] = [];
        membersList.childNodes.forEach((member: any) => {
            member.childNodes.forEach((memberChild: any) => {

                if (memberChild.id.includes('delete-member-button')) {
                    console.log('memberChild', memberChild)
                    deleteButtons.push(memberChild);
                }
            })
        })

        const subscriptions = deleteButtons.map((deleteButton: HTMLButtonElement) => {
            return fromEvent(deleteButton, 'click').subscribe(() => {
                const userId = deleteButton.id.split('-')[3];
                console.log('userId', userId);

                socketMan.send('removeUserFromGroup', {groupId: currentGroup._id, userId: userId, currentUserId: currentUser._id});
            });
        })

        return () => {
            subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            }
        )}

    }, [currentGroup])
}

export const CurrentGroup: FC<any> = (props: any) => {
    const { currentGroup = initialGroup, users = [], currentUser } = props;
    const isOwner = currentUser._id === currentGroup.owner_id;
    console.log('isOwner', isOwner)

    useAddMember(currentUser, currentGroup, currentUser);

    useDeleteMember(currentGroup, currentUser);

    return (
        <div className={styles.currentGroupContainer}>
            <h1 className={styles.currentGroupHeader}>
                CurrentGroup
            </h1>
            <div className={styles.currentGroup}>
                <h3 className={styles.currentGroupName}>
                    {currentGroup.name}
                </h3>
            </div>
            <div>
                <ul id="members-list">
                    {currentGroup.members.map((member: any) => {
                        const user = users.find((user: IUser) => user._id === member) || {};

                        if (isOwner && user._id === currentUser._id) {
                            return null;
                        }

                        const buttonId = `delete-member-button-${user._id}`;

                        return (
                            <li key={member}>
                                <span>{user.name}</span>
                                {isOwner && <button type="button" id={buttonId}>remove</button>}
                            </li>
                    )})}
                </ul>
                {isOwner && <div>
                    <input type="text" placeholder="Add member" id="add-member-input"/>
                    <button type="button" id="add-member-button">add</button>
                </div>}
            </div>
        </div>
    )
}
