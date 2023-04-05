const mongoose = require('mongoose');
const {Schema} = mongoose;

const projectSchema = new Schema({
    createdBy: String,
    createdDate: Date,
    shapes: [],
    projectId: String
});

const projectModel = mongoose.model('Project', projectSchema);
module.exports = projectModel;