import {Groups} from "../../db/models";

export const getMainGroup = async () => {
    try {
        return await Groups.findOne({name: 'Main'});
    } catch (e) {
        console.log(e);
    }
}

export const getUserGroups = async (userId: string) => {
    try {
        const groups = await Groups.find({members: userId});
        console.log('groups', groups);
        return groups;
    } catch (e) {
        console.log(e);
    }
}

export const addUserToGroup = async (userId: string, groupId: string) => {
    try {
        const group = await Groups.findById(groupId);
        group.members.push(userId);
        await group.save();
        return group;
    } catch (e) {
        console.log(e);
    }
}

export const removeUserFromGroup = async (userId: string, groupId: string) => {
    try {
        const group = await Groups.findOne({_id: groupId});
        group.members = group.members.filter((id: string) => id.toString() !== userId);
        await group.save();
        return group;
    } catch (e) {
        console.log(e);
    }
}

export const createGroup = async (name: string, owner_id: string) => {
    try {
        return await Groups.create({
            name,
            owner_id,
            members: [owner_id],
        });
    } catch (e) {
        console.log(e);
    }
}

export const deleteGroup = async (groupId: string) => {
    try {
        await Groups.findOneAndDelete({_id: groupId});
    } catch (e) {
        console.log(e);
    }
}
