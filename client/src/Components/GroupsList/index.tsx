import React, {FC} from "react";
import {Group} from "../Group";
import styles from "./GroupsList.module.scss";

export const GroupsList: FC<any> = (props: any) => {
    const { groups = [], setCurrentGroup } = props;

    return (
        <div className={styles.groupsListContainer}>
            <h1 className={styles.groupsListHeader}>
                GroupsList
            </h1>
            <ul className={styles.groupsList}>
                {groups.map((group: any) => (
                    <Group group={group} setCurrentGroup={setCurrentGroup} />
                ))}
            </ul>
        </div>

    )
}
