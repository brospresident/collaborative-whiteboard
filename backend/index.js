const express = require('express');
const apiRouter = require('./api');
const con = require('./mongo/connection');
const logger = require('nlogger').logger(module);
const cors = require('cors');

const app = express();
app.use(cors());

const server = require('http').createServer(app);
 
const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    logger.info('a user connected');

    socket.on('newData', (data) => {
        logger.info(data);
        io.emit('newData', data);
    });

    socket.on('disconnect', () => {
        logger.info('a user disconnected');
    });
});

app.use(express.json());
app.use('/', apiRouter);

server.listen(PORT, () => {
    logger.info(`Backend running on port ${PORT}`);
    con.then(resolved => {
        logger.info(`MongoDB connected at ${new Date()}`);
    }).catch(rejected => {
        logger.info(rejected);
    });
});