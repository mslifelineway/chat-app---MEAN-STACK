//initialization
require('dotenv').config();
const port = process.env.PORT;
//connecting mongo database
require('./db_connection');
const express = require('express');
const app = express();
const UserController = require('./controllers/user.controller');
const MessageController = require('./controllers/message.controller');
const cors = require('cors');
const http = require('http');



/** --- MIDDLEWARE ---*/
app.use(cors());
// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

/** ------- SOCKET INITIALIZATION --- */
const server = http.createServer(app);
const io = require('socket.io')(server);
app.set('io', io);
/** ------- SOCKET INITIALIZATION --- */

/**--- MIDDLEWARE - END --- */

/** --- HANDLING REQUESTS ---*/
app.use('/users', UserController);
app.use('/messages', MessageController);

app.all('/', (req, res) => {
    return res.json({
        status: true,
        message: "Location does not found!"
    });
});

/** START THE SERVER */
server.listen(port, (req, res) => {
    console.log('Server is running on port : ' + port);
});