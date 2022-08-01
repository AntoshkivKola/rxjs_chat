import React, {FC, useEffect, useState} from "react";
import {debounceTime, fromEvent, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {IGroup, IUser} from "../../types/user";
import {initialGroup} from "../../App";
import {useSocket} from "../../socket_manager";
import styles from "./CurrentGroup.module.scss";

const useAddMember = (memberIdToAdd:any, setMemberIdToAdd:any ,currentGroup: IGroup, currentUser: IUser) => {
    useEffect(() => {
        const socketMan = useSocket();
        const addMemberButton = document.getElementById('add-member-button') as HTMLButtonElement;

        let subscription: Subscription;
        if (memberIdToAdd !== '' && addMemberButton) {
            subscription = fromEvent(addMemberButton, 'click').subscribe(() => {
                socketMan.send('addUserToGroup', {groupId: currentGroup._id, userId: memberIdToAdd, currentUserId: currentUser._id});
            });
        }

        return () => {
            if (subscription) subscription.unsubscribe()
        }
    }, [memberIdToAdd])
}

const useChangeMemberToAdd = (setMemberIdToAdd: any, members: any) => {
    useEffect(() => {
        const newMembersList = document.getElementById('new-members-list') as HTMLUListElement;

        let newMembersButtons: HTMLButtonElement[] = [];
        if(newMembersList) {
            newMembersList.childNodes.forEach((member: any) => {
                member.childNodes.forEach((memberChild: any) => {
                    if (memberChild.id.includes('new-member-button')) {
                        newMembersButtons.push(memberChild);
                    }
                })

            })
        }

        const subscriptions = newMembersButtons.map((newMemberButton: HTMLButtonElement) => {
            return fromEvent(newMemberButton, 'click').subscribe(() => {
                const userId = newMemberButton.id.split('-')[3];
                setMemberIdToAdd(userId);
            });
        })

        return () => {
            subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            })
        }
    }, [members])

}

const useNewMembers = (newMembers: any, members: IUser[], setMembers: any) => {
    useEffect(() => {
        const addMemberInput = document.getElementById('add-member-input') as HTMLInputElement;

        let subscription: Subscription;
        if (addMemberInput) {
            subscription = fromEvent<KeyboardEvent>(addMemberInput, 'input').pipe(
                debounceTime(300),
                map((event: any) => event.target.value.trim()),
                map((value: string) => {
                    return newMembers.filter((member: IUser) => member.name.toLowerCase().includes(value.toLowerCase()));
                }),
            ).subscribe((data) => {
                setMembers(data)
            })
        }

        return () => { if (subscription) subscription.unsubscribe() }
    }, [newMembers])
}

const useDeleteMember = (currentGroup: IGroup, currentUser: IUser) => {
    useEffect(() => {
        const socketMan = useSocket();
        const membersList = document.getElementById('members-list') as HTMLUListElement;

        let deleteButtons: HTMLButtonElement[] = [];
        membersList.childNodes.forEach((member: any) => {
            member.childNodes.forEach((memberChild: any) => {

                if (memberChild.id.includes('delete-member-button')) {
                    deleteButtons.push(memberChild);
                }
            })
        })

        const subscriptions = deleteButtons.map((deleteButton: HTMLButtonElement) => {
            return fromEvent(deleteButton, 'click').subscribe(() => {
                const userId = deleteButton.id.split('-')[3];

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
    const [newMembers, setNewMembers] = useState<IUser[]>([]);
    const [members, setMembers] = useState<IUser[]>([]);
    const [memberIdToAdd, setMemberIdToAdd] = useState('');
    const isOwner = currentUser._id === currentGroup.owner_id;

    useEffect(() => {
        const socketMan = useSocket();
        socketMan.send('getNewMembers', {excludedUsers: currentGroup.members});

        socketMan.on('newMembers').subscribe((data) => {
            setNewMembers(data);
            setMembers(data);
        });
    }, [currentGroup])

    useNewMembers(newMembers, members, setMembers);

    useChangeMemberToAdd(setMemberIdToAdd, members);

    useAddMember(memberIdToAdd,setMemberIdToAdd, currentGroup, currentUser);

    useDeleteMember(currentGroup, currentUser);

    return (
        <div className={styles.currentGroupContainer}>
            <div className={styles.currentGroup}>
                <h2 className={styles.currentGroupName}>
                    {currentGroup.name}
                </h2>
            </div>
            <div className={styles.containerMembers}>
                <h4 className={styles.membersHeader}>Members</h4>
                <ul className={styles.membersList} id="members-list">
                    {currentGroup.members.map((member: any) => {
                        const user = users.find((user: IUser) => user._id === member) || {};

                        if (isOwner && user._id === currentUser._id) {
                            return null;
                        }

                        const buttonId = `delete-member-button-${user._id}`;

                        return (
                            <li className={styles.memberContainer} key={member}>
                                <span className={styles.memberName}>{user.name}</span>
                                {isOwner && <button className={styles.deleteMemberButton} type="button" id={buttonId}>remove</button>}
                            </li>
                    )})}
                </ul>
            </div>
            <div>
                {isOwner && <div>
                    <input className={styles.inputUserName} type="text" placeholder="User name" id="add-member-input"/>
                    <ul id="new-members-list" className={styles.newMembersList}>
                        {members.map((member: IUser) => {
                            const liId = `new-member-button-${member._id}`;

                            return (
                                <li className={styles.newMemberContainer} key={member._id}>
                                    <button style={{
                                        borderColor: member._id ===memberIdToAdd ? 'rgb(72 69 69)' : 'rgba(0,0,0,0)',
                                    }} className={styles.selectMemberButton} type="button" id={liId}>{member.name}</button>
                                </li>
                            )
                        })}
                    </ul>
                    <button className={styles.addMemberButton} type="button" id="add-member-button">Add new member</button>
                </div>}
            </div>
        </div>
    )
}
