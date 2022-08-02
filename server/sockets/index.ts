import {Server, Socket} from "socket.io";
import {
    addMessage, getAllUsers,
    getGroupMessages,
    getNewMembers,
    getUserFromGroup,
} from "../api/controllers/userController";
import {
    addUserToGroup,
    createGroup, deleteGroup,
    getMainGroup,
    getUserGroups,
    removeUserFromGroup
} from "../api/controllers/groupController";
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

                socket.emit('takeUsersFromGroup', userFromGroup);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('getAllUsers', async () => {
            const users = await getAllUsers();

            socket.emit('takeAllUsers', users)
        })

        
        socket.on('createGroup', async ({groupName, owner_id}) => {
            try {
                const newGroup = await createGroup(groupName, owner_id);
                const allUserGroups = await getUserGroups(owner_id); 
                
                socket.emit('takeGroup', newGroup);
                socket.emit('takeGroups', allUserGroups);
            } catch (e) {
                console.log(e);
            }
        })

        socket.on('deleteGroup', async ({group}:{group: IGroup}) => {
            try {
                await deleteGroup(group._id);
                const allUserGroups = await getUserGroups(group.owner_id);
                const mainGroup = await getMainGroup();

                socket.emit('takeGroup', mainGroup);
                socket.emit('takeGroups', allUserGroups);
            } catch (e) {
                console.log(e);
            }
        })


        socket.on('getMainGroup', async () => {
            try {
                const mainGroup = await getMainGroup();

                socket.emit('takeGroup', mainGroup);
            } catch (e) {
                console.log(e);
            }
        })

        socket.on('getUserGroups', async (userId) => {
            try {
                const groups = await getUserGroups(userId);

                socket.emit('takeGroups', groups);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('addUserToGroup', async ({userId, groupId, currentUserId}: {userId: string, groupId: string, currentUserId: string}) => {
            try {
                const currentGroup = await addUserToGroup(userId, groupId);
                const groups = await getUserGroups(currentUserId) as IGroup[];


                const addUserSocketId = users[userId];
                if (addUserSocketId) {
                    //@ts-ignore
                    io.sockets.sockets.get(addUserSocketId).join(groupId);
                }

                io.in(groupId).emit('takeGroups', groups);
                socket.emit('takeGroup', currentGroup);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('removeUserFromGroup', async ({userId, groupId, currentUserId}) => {
            try {
                const currentGroup = await removeUserFromGroup(userId, groupId);
                const groups = await getUserGroups(currentUserId);
                const groupsUpdatedUser = await getUserGroups(userId);
                const mainGroup = await getMainGroup();

                const removeUserSocketId = users[userId];
                if (removeUserSocketId) {
                    //@ts-ignore
                    const deletedMemberSocket = io.sockets.sockets.get(users[userId]) as Socket;
                    deletedMemberSocket.leave(groupId) ;
                    deletedMemberSocket.emit('takeGroups', groupsUpdatedUser);
                    deletedMemberSocket.emit('takeGroup', mainGroup);
                }

                io.in(groupId).emit('takeGroups', groups);
                io.in(groupId).emit('takeGroup', currentGroup);
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
