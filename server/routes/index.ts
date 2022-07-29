const { Router } = require('express');
const userRouter = require('./user');
const {stuffRouter} = require('./stuff');
const devRouter = require('./dev');

const router = Router();

router.use('/', userRouter, stuffRouter, devRouter);

module.exports = router;
