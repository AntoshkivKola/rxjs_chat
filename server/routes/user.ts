const { Router } = require('express');
import {Users} from "../db/models";
const userRouter = Router();

userRouter.post('/login', async (req: any, res: any) => {
    const {login, password} = req.body;
    console.log('/login req.body',req.body);
    const user = await Users.findOne({login, password});
    if (user) {
        return res.send(user)
    }

    return res.sendStatus(404);
});

module.exports = userRouter;
