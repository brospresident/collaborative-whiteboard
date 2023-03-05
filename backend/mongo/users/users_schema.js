const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    join_date: Date,
    projects: [{
        project_id: String,
        roles: [String]
    }]
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;