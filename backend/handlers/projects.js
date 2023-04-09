const express = require('express');
const projectsQuery = require('../mongo/projects/projects_query');
const crypto = require('crypto');
const logger = require('nlogger').logger(module);
const usersQuery = require('../mongo/users/users_query');
const async = require('async');

function generateProjectId() {
    return crypto.randomBytes(10).toString('hex');
}

/**
 * Save ID in User
 * Save full project in Projects document from mongo
 */

const projects = {
    add_project: function(req, res, next) {
        let createdBy = req.body.params.createdBy;
        let name = req.body.params.name;
        let projectId = generateProjectId();

        projectsQuery.add_project(createdBy, name, projectId, (err, _result) => {
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
                });
            }
        });
    },

    get_projects_data: function(req, res, next) {
        let projects = req.body.params.projectIds;
        projects = projects.map(project => project.project_id);

        let projects_data = [];

        if (!projects.length) {
            res.json({id: 1, error: 'no projects'});
            return;
        }

        async.eachLimit(projects, 3, (project, callback) => {
            projectsQuery.get_project_data(project, (error, result) => {
                if (error) {
                    callback(error);
                } else {
                    projects_data.push(result);
                    callback();
                }
            });
        }, (error) => {
            if (error) {
                logger.info(error);
                res.json({id: 1, error});
                return;
            } else {
                res.json({id: 1, error: null, result: projects_data});
                return;
            }
        });
    }
}

module.exports = projects;