const mongoose = require('mongoose');
// code for making schema
const mySchema = new mongoose.Schema({
    email: String,
    password: String,
    address: String,
    dob: String,
    profession: String,
})

// code for making model
const myModel = mongoose.model('account', mySchema);
module.exports = myModel;