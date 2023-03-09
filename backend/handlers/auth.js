const bcrypt = require('bcrypt');
const usersQuery = require('../mongo/users/users_query');
const jwt = require('jsonwebtoken');
const logger = require('nlogger').logger(module);

function encrypt_password(password, cb) {
    bcrypt.hash(password, 10, (err, encrypted) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, encrypted);
        }
    });
}

function compare_password(encrypted, plain, cb) {
    bcrypt.compare(plain, encrypted, (err, same) => {
        if (err) {
            cb(err, null);
            return;
        } else {
            cb(null, same);
        }
    });
}

function generateToken(payload) {
    return jwt.sign(payload, 'JSONWEBSECRET');
}

module.exports = {
    register: function(req, res, next) {
        let username = req.body.params.username;
        let password = req.body.params.password;

        if (!username || !password) {
            res.json({id: 1, error: 'No username/password provided', result: null});
            return;
        }

        usersQuery.getUser(username, (err, data) => {
            if (data) {
                res.json({id: 1, error: 'There already is someone with this username.', result: null});
                return;
            } else {
                encrypt_password(password, (err, encrypted) => {
                    if (err) {
                        res.json({id: 1, error: 'Something wrong happened. Try again later.'});
                        return;
                    }

                    if (encrypted) {
                        usersQuery.insertUser({username: username, password: encrypted}, (err, done) => {
                            if (err) {
                                res.json({id: 1, error: 'Something wrong happened. Try again later.'});
                                return;
                            }
                            let token = generateToken(JSON.stringify({username: username, password: encrypted}));
                            if (done) {
                                let result = {
                                    token: token,
                                    username: username
                                }
                                res.json({id: 1, error: null, result: result});
                            }
                        });
                    }
                });
            }
        });
    },
    
    login: function(req, res, next) {
        let username = req.body.params.username;
        let password = req.body.params.password;

        if (!username || !password) {
            res.json({id: 1, error: 'No username/password provided', result: null});
            return;
        }

        usersQuery.getUser(username, (err, data) => {
            if (data) {
                compare_password(data.password, password, (err, same) => {
                    if (err) {
                        res.json({id: 1, error: 'Wrong username or password'});
                        return;
                    } else {
                        if (same) {
                            let token = generateToken(JSON.stringify({username: username, password: data.password}));
                            let result = {
                                token: token,
                                username: username
                            }
                            res.json({id: 1, error: null, result: result});
                            return;
                        } else {
                            res.json({id: 1, error: 'Wrong username or password'});
                            return;
                        }
                    }
                });
            } else {
                res.json({id: 1, error: 'No user with that username'});
                return;
            }
        });
    }
}