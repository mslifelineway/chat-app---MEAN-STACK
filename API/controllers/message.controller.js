//init code
const router = require('express').Router();
const Message = require('../models/message.model');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const helperMethods = require('./helper.methods');

/** -- MIDDLEWARE -- */
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//form validation
const messageValidator = [
    check('senderId').not().isEmpty().trim().escape(),
    check('receiverId').not().isEmpty().trim().escape(),
    check('message').not().isEmpty().trim(),
];

/** -- MIDDLEWARE END */


/** ---- REQUEST MAPPING --- */

//save a message
router.post('/', messageValidator, (req, res) => {
    let helper = new helperMethods();
    let errors = validationResult(req);
    let messageValidationError = helper.identifyErrors(errors, res);
    if (messageValidationError)
        return messageValidationError;

    //now, since there is no error and fields are not missing that is all required fields are available here, so let's save to the database
    let newMessage = new Message(req.body);
    newMessage.save().then((savedMessage) => {
        const io = req.app.get('io');
        io.emit("NewMessageAdded");
        return res.json({
            status: true,
            message: "Message Sent!",
            result: savedMessage,
        });
    }).catch((e) => {
        return res.json({
            status: false,
            message: "Message couldn't sent!",
            result: e,
        });
    });

});


/** FIND MESSAGES OF SENDER AND RECEIVER (i.e. by two ids : sender id and receiver id) */
/** URL: /messages/:id/messages */
router.get('/:senderId/:receiverId/', (req, res) => {
    Message.findConversationOfTwoUsers(req.params.senderId, req.params.receiverId).then((messages) => {
        return res.json({
            status: true,
            message: "Messages Found!",
            result: messages,
        });
    }).catch((e) => {
        return res.json({
            status: false,
            message: "Oops! something went wrong while fetching data from database.",
            result: e,
        });
    });
});

router.delete('/:messageId/:senderId', (req, res) => {

    Message.findOneAndRemove({_id: req.params.messageId,  senderId: req.params.senderId}).then((removedMessage) => {
        const io = req.app.get('io');
        io.emit("AMessageDeleted");
        return res.json({
            status: true,
            message: "Message deleted!",
            result: removedMessage,
        });
    }).catch((e) => {
        return res.json({
            status: false,
            message: "Message couldn't delete!",
            result: e,
        });
    });
});

//exporting the message router
module.exports = router;

