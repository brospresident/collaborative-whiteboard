const mongoose = require('mongoose');
const userModel = require('./users_schema');
const logger = require('nlogger').logger(module);



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
    userModel.findOneAndUpdate({username: username}, { 
        $push: {
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

function deleteProjectInvitation(username, project_id, callback) {
    getUser(username, (error, result) => {
        if (error) {
            logger.info(error);
            return;
        }

        result.invitations = result.invitations.filter((item) => {
            return item.item.project_id != project_id;
        });

        logger.info(result);

        result.save().then(saved => {
            logger.info('ok');
            callback(null, 'ok');
        }).catch(rejected => {
            logger.info('not ok');
            callback('not ok', null);
        });
    })
}

function deleteProjectFromUser(username, project_id, callback) {
    getUser(username, (error, result) => {
        if (error) {
            logger.info(error);
            return;
        }

        result.projects = result.projects.filter((item) => {
            return item.project_id != project_id;
        });

        logger.info(result);

        result.save().then(saved => {
            logger.info('ok');
            callback(null, 'ok');
        }).catch(rejected => {
            logger.info('not ok');
            callback('not ok', null);
        });
    });
}

function insertProjectInvitation(username, invited_by, project_id, callback) {
    userModel.findOneAndUpdate({username: username}, {
        $push: {
            invitations: {
                item: {
                    project_id: project_id,
                    invited_by: invited_by,
                    invitation_date: new Date()
                }
            }
        }
    }, {new: true}).then(data => {
        callback(null, data);
    }).catch(rejected => {
        callback(rejected, null);
    });
}

module.exports = {
    insertUser,
    getUser,
    addProjectToUser,
    deleteProjectInvitation,
    insertProjectInvitation,
    deleteProjectFromUser
}