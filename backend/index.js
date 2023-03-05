const express = require('express');
const apiRouter = require('./api');
const con = require('./mongo/connection');
const logger = require('nlogger').logger(module);
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/', apiRouter);

app.listen(PORT, () => {
    logger.info(`Backend running on port ${PORT}`);
    con.then(resolved => {
        logger.info(`MongoDB connected at ${new Date()}`);
    }).catch(rejected => {
        logger.info(rejected);
    });
});