const logger = require('nlogger').logger(module);
const projectModel = require('./projects_schema');

module.exports = {
    add_project: function(createdBy, name, projectId, callback) {
        const newProject = new projectModel({
            createdBy,
            createdDate: new Date(),
            projectId,
            shapes: [],
            name: name
        });

        newProject.save().then(saved => {
            if (saved) {
                callback(null, saved);
                return;
            }
        }).catch(rejected => {
            if (rejected) {
                callback(rejected, null);
                return;
            }
        });
    },

    edit_project_shapes: function(projectId, shapes, callback) {
        projectModel.findOneAndUpdate({projectId: projectId}, {
            $set: {
                shapes: shapes
            }
        }).then(resolved => {
            if (resolved) {
                callback(null, resolved);
                return;
            }
        }).catch(rejected => {
            if (rejected) {
                callback(rejected, null);
                return;
            }
        });
    },

    get_project_data: function(projectId, callback) {
        projectModel.findOne({projectId: projectId}).then(data => {
            logger.info(data);
            callback(null, data);
        }).catch(reject => {
            callback(reject, null);
        });
    },

    save_project_data: function(projectId, shapes, callback) {
        this.get_project_data(projectId, (error, result) => {
            if (error) {
                logger.info(error);
                callback(error, null);
            } else {
                result.shapes = shapes;

                result.save().then(saved => {
                    if (saved) {
                        callback(null, saved);
                    }
                }).catch(rejected => {
                    if (rejected) {
                        callback(rejected, null);
                    }
                });
            }
        });
    }
}

