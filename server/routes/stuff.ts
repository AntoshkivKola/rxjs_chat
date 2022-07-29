{
    const {Router} = require('express');

    const stuffRouter = Router();

    let count = 0;
    stuffRouter.get('/', (req: any, res: any) => {
        console.log('get request')
        res.send({text: 'Hello World!', count: count++})
    });

    module.exports = {stuffRouter};
}
