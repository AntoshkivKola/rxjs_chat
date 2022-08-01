import {Server, Socket} from "socket.io";
import {
    addMessage,
    getGroupMessages,
    getNewMembers,
    getUserFromGroup,
} from "../api/controllers/userController";
import {addUserToGroup, getMainGroup, getUserGroups, removeUserFromGroup} from "../api/controllers/groupController";
import {IGroup} from "../db/shcemas";

export const initSocket = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "OPTIONS"]
        }
    });

    const users: {[key: string]: any} = {};

    io.on('connection', (socket: Socket) => {
        console.log('a user connected');

        socket.on('join', function(user){
            console.log('join', user);
            users[user._id] = socket.id;
        })

        socket.on('chat message', async ({author, message, group}) => {
            try {
                await addMessage(author, message, group);
                const massages = await getGroupMessages(group._id);

                io.in(group._id).emit('getMessages', massages);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('getGroupMessages', async ({groupId}) => {
            try {
                const massages = await getGroupMessages(groupId);
                //console.log('massages: ', groupId, massages);
                socket.join(groupId);
                socket.emit('getMessages', massages);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('getUserFromGroup', async ({groupId}) => {
            try {
                const userFromGroup = await getUserFromGroup(groupId);

                socket.emit('getUsers', userFromGroup);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('getMainGroup', async () => {
            try {
                const mainGroup = await getMainGroup();

                socket.emit('getGroup', mainGroup);
            } catch (e) {
                console.log(e);
            }
        })

        socket.on('getUserGroups', async (userId) => {
            try {
                const groups = await getUserGroups(userId);

                socket.emit('getGroups', groups);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('addUserToGroup', async ({userId, groupId, currentUserId}: {userId: string, groupId: string, currentUserId: string}) => {
            try {
                await addUserToGroup(userId, groupId);
                const groups = await getUserGroups(currentUserId) as IGroup[];
                const currentGroup = groups.find(group => group._id.toString() === groupId);


                const addUserSocketId = users[userId];
                if (addUserSocketId) {
                    //@ts-ignore
                    io.sockets.sockets.get(addUserSocketId).join(groupId);
                }

                io.in(groupId).emit('getGroups', groups);
                socket.emit('getGroup', currentGroup);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('removeUserFromGroup', async ({userId, groupId, currentUserId}) => {
            try {
                await removeUserFromGroup(userId, groupId);
                const groups = await getUserGroups(currentUserId) as IGroup[];
                const currentGroup = groups.find(group => group._id.toString() === groupId);

                const groupsUpdatedUser = await getUserGroups(userId) as IGroup[];
                const mainGroup = await getMainGroup();
                console.log('users', users)
                const removeUserSocketId = users[userId];
                if (removeUserSocketId) {
                    //@ts-ignore
                    const deletedMemberSocket = io.sockets.sockets.get(users[userId]) as Socket;
                    deletedMemberSocket.leave(groupId) ;
                    deletedMemberSocket.emit('getGroups', groupsUpdatedUser);
                    deletedMemberSocket.emit('getGroup', mainGroup);
                }

                io.in(groupId).emit('getGroups', groups);
                io.in(groupId).emit('getGroup', currentGroup);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('getNewMembers', async ({excludedUsers}) => {
            const users = await getNewMembers(excludedUsers);

            socket.emit('newMembers', users);
        });


        socket.on('disconnect', () => {
            console.log('user disconnected');

            users[Object.keys(users).find(key => users[key] === socket.id) as string] = null;
        });
    });
}
