import {Server, Socket} from "socket.io";
import {addMessage, getGroupMessages, getMainGroup, getUserFromGroup} from "../api/controllers/userController";

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

                io.emit('send massages', massages);
            } catch (e) {
                console.log(e);
            }
            console.log('message: ', message, ' author: ', author);
        });

        socket.on('getGroupMessages', async ({groupId}) => {
            try {
                const massages = await getGroupMessages(groupId);
                //console.log('massages: ', groupId, massages);
                io.emit('send massages', massages);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('getUserFromGroup', async ({groupId}) => {
            try {
                const userFromGroup = await getUserFromGroup(groupId);
                console.log('userFromGroup', userFromGroup)
                io.emit('send users', userFromGroup);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('getMainGroup', async () => {
            try {
                const mainGroup = await getMainGroup();

                io.emit('send group', mainGroup);
            } catch (e) {
                console.log(e);
            }
        })


        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}
