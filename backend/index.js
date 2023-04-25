const express = require('express');
const apiRouter = require('./api');
const con = require('./mongo/connection');
const logger = require('nlogger').logger(module);
const cors = require('cors');
const utils = require('./utils');

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
    logger.info(`A user with id ${socket.id} just joined.`);

    socket.on('joinedOnDrawer', (data) => {
        data = JSON.parse(data);
        let id = data.id;

        utils.call_backend('projects.add_active_user_on_project', {id}, (error, result) => {
            if (error) {
                throw error;
            } else {
                // logger.info('user count incremented');
            }
        })
    });

    socket.on('leftDrawer', (data) => {
        data = JSON.parse(data);
        let id = data.id;

        utils.call_backend('projects.remove_active_user_on_project', {id}, (error, result) => {
            if (error) {
                throw error;
            }
        });
    });

    socket.on('server:draw', (data) => {
        logger.info(data);
        socket.broadcast.emit('client:draw', data);

        utils.call_backend('projects.update_project_data', {data}, (error, result) => {
            if (error) {
                logger.info(error);
            } else {
                logger.info(result.result);
            }
        });
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
        process.exit(1);
    });
});