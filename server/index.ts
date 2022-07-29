import {initSocket} from "./sockets";

const express = require('express')
const app = express()
const cors = require('cors')
import {checkAndSeedUsers} from "./api/controllers/userController";
const router = require('./routes');

//checkAndSeedUsers();
//

const port = 3333;

app.use(cors())
app.use(express.json())


app.use('/', router);

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

initSocket(server);
