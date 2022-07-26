import {Socket} from "socket.io";
const express = require('express')
const app = express()
const cors = require('cors')
const { Server } = require("socket.io");

const port = 3333;

app.use(cors())
app.use(express.json())

let count = 0;
app.get('/', (req: any, res: any) => {
    console.log('get request')
    res.send({text: 'Hello World!', count: count++})
});

app.post('/login', async (req: any, res: any) => {
    const {login, password} = req.body;

    const user = await Users.findOne({login, password});

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
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
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

