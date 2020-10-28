//init code
const mongoose = require('mongoose');


//schema
const MessageSchema = mongoose.Schema({
    senderId: {
        type: String,
        required: true,
        trim: true,
    },
    receiverId: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    sentAt: {
        type: Date,
        default: Date.now(),
    },
    hasRead: {
        type: Boolean,
        default: false,
    }
});

/** MODEL METHODS */
MessageSchema.statics.findConversationOfTwoUsers = function (senderId, receiverId) {
    let Message = this;
    // 'or' operation: find({ $or: [{ 'senderId': senderId }, { 'receiverId': receiverId }] })
    // 'or' followed by 'and' operations: find({ $or: [{ $and: [{ 'senderId': senderId }, { 'receiverId': receiverId }] }, { $and: [{ 'receiverId': senderId }, { 'senderId': receiverId }] }] })

    return Message.find({ $or: [{ $and: [{ 'senderId': senderId }, { 'receiverId': receiverId }] }, { $and: [{ 'receiverId': senderId }, { 'senderId': receiverId }] }] }).then((messages) => {
        if (!messages) return Promise.reject();

        return Promise.resolve(messages);
    }).catch((e) => {
        return Promise.reject();
    });
}

//model creation
mongoose.model('Messages', MessageSchema);

//exporting model
module.exports = mongoose.model('Messages');