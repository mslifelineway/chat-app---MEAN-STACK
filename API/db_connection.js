//initialization
require('dotenv').config();
const port = process.env.PORT;
const db_url = process.env.DB_URL;
const mongoose = require('mongoose');
const assert = require('assert');

//connection to Mongo Database
mongoose.connect(db_url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }, (error, link) => {
    //check for error occure while connecting mongo database
    assert.equal(error, null, "Database connection failed!");
    //everything is ok, so database connected successfully
});


//exporting mongo db
module.exports = mongoose;