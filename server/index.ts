import {Socket} from "socket.io";
const express = require('express')
const app = express()
const cors = require('cors')
const { Server } = require("socket.io");
/*import {Users} from "./db/models";
import {IUser} from "./db/shcemas";
import {seedUsers} from "./db/seeders";*/
/*

const getUsers = async () => {
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
*/

//getUsers();
//

const port = 3333;

app.use(cors())
app.use(express.json())

let count = 0;
app.get('/', (req: any, res: any) => {
    console.log('get request')
    res.send({text: 'Hello World!', count: count++})
});
//
/*app.get('/seedUsers', (req: any, res: any) => {
    seedUsers();
    res.send(getUsers())
});*/

app.post('/login', async (req: any, res: any) => {
    const {login, password} = req.body;
    console.log('/login req.body',req.body);
    //const user = await Users.findOne({login, password});
    const user = {};
    if (user) {
        return res.send(user)
    }

    return res.sendStatus(404);
});

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"]
    }
});
io.on('connection', (socket: Socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

