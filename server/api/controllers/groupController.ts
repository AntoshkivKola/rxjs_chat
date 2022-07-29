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
