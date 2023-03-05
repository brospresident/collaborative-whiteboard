const express = require('express');
const handlers = require('./handlers/handlers');

const apiRouter = express.Router();

apiRouter.post('/api', (req, res, next) => {
    let endpoint = req.body.endpoint;
    let object = endpoint.split('.')[0];
    let method = endpoint.split('.')[1];

    if (!object || !method) {
        res.json({id: 1, error: 'Not JSON RPC!', result: null});
        return;
    }

    if (handlers[object] && handlers[object][method]) {
        handlers[object][method](req, res, next);
    }
});

module.exports = apiRouter;