const express = require('express');
const projectsQuery = require('../mongo/projects/projects_query');
const crypto = require('crypto');
const logger = require('nlogger').logger(module);
const usersQuery = require('../mongo/users/users_query');
const async = require('async');


function generateProjectId() {
    return crypto.randomBytes(10).toString('hex');
}

let activeProjects = {};
function activeProjectsSignal(projectId, signal) {
    if (activeProjects[projectId]) {
        if (signal == 'increase') {
            activeProjects[projectId]++;
        } if (signal == 'decrease') {
            activeProjects[projectId]--;
        }
    } else {
        activeProjects[projectId] = 1;
    }
}

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
    },

    add_active_user_on_project: function(req, res, next) {
        let id = req.body.params.id;
        
        activeProjectsSignal(id, 'increment');

        res.json({id: 1, error: null, result: 'ok'});
    },

    delete_active_user_on_project: function(req, res, next) {
        let id = req.body.params.id;

        activeProjectsSignal(id, 'decrement');

        res.json({id: 1, error: null, result: 'ok'});
    }
}

module.exports = projects;