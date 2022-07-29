import {Server, Socket} from "socket.io";
import {addMessage, getGroupMessages, getUserFromGroup} from "../api/controllers/userController";
import {addUserToGroup, getMainGroup, getUserGroups, removeUserFromGroup} from "../api/controllers/groupController";
import {IGroup} from "../db/shcemas";

export const initSocket = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "OPTIONS"]
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('a user connected');

        socket.on('chat message', async ({author, message, group}) => {
            try {
                await addMessage(author, message, group);
                const massages = await getGroupMessages(group._id);

                io.emit('getMessages', massages);
            } catch (e) {
                console.log(e);
            }
            console.log('message: ', message, ' author: ', author);
        });

        socket.on('getGroupMessages', async ({groupId}) => {
            try {
                const massages = await getGroupMessages(groupId);
                //console.log('massages: ', groupId, massages);
                io.emit('getMessages', massages);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('getUserFromGroup', async ({groupId}) => {
            try {
                const userFromGroup = await getUserFromGroup(groupId);
                console.log('userFromGroup', userFromGroup)
                io.emit('getUsers', userFromGroup);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('getMainGroup', async () => {
            try {
                const mainGroup = await getMainGroup();

                io.emit('getGroup', mainGroup);
            } catch (e) {
                console.log(e);
            }
        })

        socket.on('getUserGroups', async (userId) => {
            try {
                const groups = await getUserGroups(userId);

                io.emit('getGroups', groups);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('addUserToGroup', async ({userId, groupId, currentUserId}) => {
            try {
                await addUserToGroup(userId, groupId);
                const groups = await getUserGroups(currentUserId) as IGroup[];
                const currentGroup = groups.find(group => group._id === groupId);

                io.emit('getGroups', groups);
                io.emit('getGroup', currentGroup);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('removeUserFromGroup', async ({userId, groupId, currentUserId}) => {
            try {
                await removeUserFromGroup(userId, groupId);
                const groups = await getUserGroups(currentUserId) as IGroup[];
                const currentGroup = groups.find(group => group._id.toString() === groupId);
                console.log('!!!removeUserFromGroup', currentGroup, groupId);
                io.emit('getGroups', groups);
                io.emit('getGroup', currentGroup);
            } catch (e) {
                console.log(e);
            }
        });


        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}
