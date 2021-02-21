const express = require('express');
const userRouter = require('./users');
const authRouter = require('./auth');
const apiRouter = express.Router();

apiRouter.get('/', (req, res) => {
    res.status(200).send("Used item login service API root. See /documentation");
})

apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);

module.exports = apiRouter;