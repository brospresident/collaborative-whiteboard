const express = require('express');
const projectsQuery = require('../mongo/projects/projects_query');
const crypto = require('crypto');
const { logger } = require('nlogger');
const usersQuery = require('../mongo/users/users_query');

function generateProjectId() {
    return crypto.randomBytes(10).toString('utf8');
}

/**
 * Save ID in User
 * Save full project in Projects document from mongo
 */

const projects = {
    add_project: function(req, res, next) {
        let createdBy = req.body.params.createdBy;
        let projectId = generateProjectId();

        projectsQuery.add_project(createdBy, projectId, (err, _result) => {
            if (err) {
                logger.info(err);
                res.json({id: 1, error: err});
                return;
            } else {
                usersQuery.addProjectToUser(createdBy, projectId, [], (error, result) => {
                    if (error) {
                        logger.info(error);
                        res.json({id: 1, error});
                        return;
                    } else {
                        res.json({id: 1, error: null, result});
                        return;
                    }
                })
            }
        });
    },

    invitation_accepted: function(req, res, next) {
        let username = req.body.params.username;
        let projectId = req.body.params.projectId;

        usersQuery.addProjectToUser(username, projectId, [], (error, result) => {
            if (error) {
                logger.info(error);
                res.json({id: 1, error});
                return;
            } else {
                // TODO: SA STEARGA ddin user invitatia la proiectul projectId (query + call la db aici)
                res.json({id: 1, error: null, result});
                return;
            }
        });
    }
}

module.exports = projects;