const mongoose = require('mongoose');
const userModel = require('./users_schema');
const  logger  = require('nlogger').logger(module);


function insertUser(data, callback) {
    const user = new userModel({
        username: data.username,
        password: data.password,
        join_date: new Date(),
        projects: []
    });

    user.save().then(doc => {
        callback(null, doc);
    }).catch(reject => {
        callback(reject, null);
    });
}

function getUser(username, callback) {
    userModel.findOne({username: username}).then(data => {
        if (data) {
            logger.info(data);
            callback(null, data);
        } else {
            callback(null, null);
        }
    }).catch(reject => {
        if (reject) {
            logger.info(reject);
            callback(reject, null);
        }
    });
}

function addProjectToUser(username, project_id, roles, callback) {
    userModel.findOneAndUpdate({username: username}, 
        { $push: {
            projects: {
                project_id: project_id,
                roles: roles
            }
        }},
        { new: true }).then(data => {
            callback(null, data);
        }).catch(rejected => {
            callback(rejected, null);
        });
}

module.exports = {
    insertUser,
    getUser,
    addProjectToUser
}