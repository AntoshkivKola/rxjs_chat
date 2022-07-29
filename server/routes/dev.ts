const {Router} = require('express');
import {checkAndSeedUsers} from "../api/controllers/userController";
const devRouter = Router();


devRouter.get('/seedUsers', (req: any, res: any) => {
    res.send(checkAndSeedUsers())
});

module.exports = devRouter;
