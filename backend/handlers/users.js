const express = require('express');
const usersQuery = require('../mongo/users/users_query');
const logger = require('nlogger').logger(module);


const users = {
    getUserProjects: function(req, res, next) {
        let username = req.body.params.username;
        usersQuery.getUser(username, (error, result) => {
            if (error) {
                logger.info(error);
                res.json({id: 1, error});
                return;
            } else {
                let projects = result.projects;
                res.json({id: 1, error: null, result: projects});
                return;
            }
        });
    },

    getUserInvitations: function(req, res, next) {
        let username = req.body.params.username;
        usersQuery.getUser(username, (error, result) => {
            if (error) {
                logger.info(error);
                res.json({id: 1, error});
                return;
            } else {
                let invitations = result && result.invitations;
                logger.info(invitations);
                res.json({id: 1, error: null, result: invitations});
                return;
            }
        });
    },

    accept_invite: function(req, res, next) {
        let username = req.body.params.username;
        let projectId = req.body.params.projectId;

        usersQuery.addProjectToUser(username, projectId, [], (error, result) => {
            if (error) {
                logger.info(error);
                res.json({id: 1, error});
                return;
            } else {
                usersQuery.deleteProjectInvitation(username, projectId, (err, _res) => {
                    if (err) {
                        logger.info(err);
                        res.json({id: 1, error: err});
                        return;
                    } else {
                        res.json({id: 1, error: null, result: _res});
                        return;
                    }
                });
            }
        });
    },

    reject_invite: function(req, res, next) {
        let username = req.body.params.username;
        let projectId = req.body.params.projectId;

        logger.info({username, projectId});

        usersQuery.deleteProjectInvitation(username, projectId, (error, result) => {
            if (error) {
                logger.info(error);
                res.json({id: 1, error});
                return;
            } else {
                logger.info(result);
                res.json({id: 1, error: null, result});
                return;
            }
        });
    },

    send_invitation: function(req, res, next) {
        let invited_by = req.body.params.invited_by;
        let invited_username = req.body.params.invited_username;
        let project_id = req.body.params.project_id;

        usersQuery.insertProjectInvitation(invited_username, invited_by, project_id, (error, result) => {
            if (error) {
                // logger.info(error);
                // logger.info(error);
                res.json({id: 1, error});
                return;
            } else {
                res.json({id: 1, error: null, result});
                return;
            }
        })
    },

    leave_project: function(req, res, next) {
        let username = req.body.params.username;
        let project_id = req.body.params.project_id;

        usersQuery.deleteProjectFromUser(username, project_id, (error, result) => {
            if (error) {
                res.json({id: 1, error});
                return;
            } else {
                res.json({id: 1, error: null, result});
                return;
            }
        });
    }
}

module.exports = users;