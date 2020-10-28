//init code
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//user schema
const UserSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
    },

    password: {
        type: String,
        required: true,
        trim: true,
    },

    image: {
        type: String,
        trim: true,
        default: "default.png",
    },

    isActive: {
        type: Boolean,
        default: false,
    },

    createdOn: {
        type: Date,
        default: Date.now(),
    },

});


/* MODEL METHODS (static methods) */

//find by credentials
UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) return Promise.reject();

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                }
                else {
                    reject();
                }
            })
        })
    })
}




/* MODEL METHODS (static methods) */

//creating model of UserSchema
const UserModel = mongoose.model('Users', UserSchema);

//exporting user model
module.exports = mongoose.model('Users');
