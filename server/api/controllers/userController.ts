import {IGroup, IUser} from "../../db/shcemas";
import {Users, Massages, Groups} from "../../db/models";
import {seedUsers} from "../../db/seeders";

export const addMessage = async (author: IUser, message: string, group: IGroup) => {
    try {
        await Massages.create({
            text: message,
            data: new Date().toLocaleString(),
            author_id: author._id,
            group_id: group._id,
        });

    } catch (e) {
        console.log(e);
    }
}

export const getGroupMessages = async (groupId: string) => {
    try {
        const massages = await Massages.find({group_id: groupId});

        return massages;
    } catch (e) {
        console.log(e);
    }
}

export const getUsers = async () => {
    try {
        const users = await Users.find();

        return users;
    } catch (e) {
        console.log(e);
    }
}

export const getUserFromGroup = async (groupId: string) => {
    try {
        console.log('groupId', groupId)
        const group = await Groups.findOne({_id: groupId});
        const users = await Users.find({_id: { $in: group.members }});

        return users;
    } catch (e) {
        console.log(e);
    }
}

export const getMainGroup = async () => {
    try {
        return await Groups.findOne({name: 'Main'});
    } catch (e) {
        console.log(e);
    }
}


export const checkAndSeedUsers = async () => {
    Users.find({}, (err: any, users: IUser[] ) => {
        if (err) {
            console.log(err);
        } else {
            console.log(users);

            if (users.length === 0) {
                seedUsers();
            }
        }
    });
}
