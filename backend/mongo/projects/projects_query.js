const projectModel = require('./projects_schema');

module.exports = {
    add_project: function(createdBy, projectId, callback) {
        const newProject = new projectModel({
            createdBy,
            createdDate: new Date(),
            projectId,
            shapes: []
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
    }
}

