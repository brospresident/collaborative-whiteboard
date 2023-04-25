const express = require('express');
const projectsQuery = require('../mongo/projects/projects_query');
const crypto = require('crypto');
const logger = require('nlogger').logger(module);
const usersQuery = require('../mongo/users/users_query');
const async = require('async');
const utils = require('../utils');


function generateProjectId() {
    return crypto.randomBytes(10).toString('hex');
}

let activeProjects = {};
function activeProjectsSignal(projectId, signal) {
    if (activeProjects[projectId]) {
        if (signal == 'increase') {
            activeProjects[projectId].count++;
        } if (signal == 'decrease') {
            activeProjects[projectId].count--;

            if (activeProjects[projectId].count == 0) {
                delete activeProjects[projectId];
            }
            
        }
    } else {
        activeProjects[projectId] = {
            count: 1,
            shapes: [],
            lastUpdate: new Date().getTime()
        }
    }

    logger.info(activeProjects);
}

function updateProjectData(data) {
    if (!activeProjects[data.projectId]) {
        activeProjectsSignal(data.projectId, 'increase');
    }

    activeProjects[data.projectId].shapes = data.shapes;
    activeProjects[data.projectId].lastUpdate = new Date().getTime();

    logger.info(activeProjects[data.projectId]);
}

setInterval(() => {
    let projectKeys = Object.keys(activeProjects);

    async.eachLimit(projectKeys, 3, (project, callback) => {
        if (activeProjects[project].shapes.length != 0) {
            projectsQuery.save_project_data(project, activeProjects[project].shapes, (error, result) => {
                if (error) {
                    callback(error);
                } else {
                    logger.info(`saved project with id ${project}`);
                    logger.info(result);
                    callback();
                }
            });
        }
    }, error => {
        if (error) {
            logger.info(error);
        }
    });
}, 30000);

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

        activeProjectsSignal(id, 'decrease');

        res.json({id: 1, error: null, result: 'ok'});
    },

    update_project_data: function(req, res, next) {
        let data = req.body.params.data;
        data = JSON.parse(data);

        updateProjectData(data);

        res.json({id: 1, error: null, result: activeProjects});
    },

    get_shapes: function(req, res, next) {
        let project_id = req.body.params.projectId;

        if (activeProjects[project_id]) {
            logger.info('intra aici');
            res.json({id: 1, error: null, result: activeProjects[project_id]});
            return;
        }

        let projectIds = [{project_id}];

        let params = {projectIds};

        utils.call_backend('projects.get_projects_data', params, (error, result) => {
            logger.info('intra aici 2');
            if (error) {
                // logger.info(error);
                res.json({id: 1, error, result: null});
            } else {
                logger.info(result);
                res.json({id: 1, error: null, result: result.data.result});
            }
        });
    }
}

module.exports = projects;