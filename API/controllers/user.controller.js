//init code
const router = require('express').Router();
const User = require('../models/user.model');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const helperMethods = require('./helper.methods');

/** -- MIDDLEWARE -- */
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
/** -- MIDDLEWARE END */

/** -- CONTROLLER MAPPING */
//form validation
const nameEmailPasswordValidation = [
    check('name').not().isEmpty().trim().escape(),
    check('email').isEmail().trim().normalizeEmail(),
    check('password').not().isEmpty().trim().escape(),

];

const emailAndPasswordValidation = [
    check('email').isEmail().trim().normalizeEmail(),
    check('password').not().isEmpty().trim().escape(),
];

//check not empty fields such as name, email, password etc
//form input name must be same as written inside check('') 
//escape() converts the special character into html entities like '> to &gt;'

/** FIND ALL THE USERS (LATER WE CAN DELETE THIS) */
router.get('/', (req, res) => {
    return User.find().then((users) => {
        return res.status(200).json({
            status: true,
            message: "Users found!",
            result: users
        });
    }).catch((e) => {
        //400 = bad syntax
        return res.status(400).json({
            status: false,
            message: "Failed to fetch users from the database!",
            result: e
        });
    });
});

//registering new user
/**
 * Method: Post
 * url: /users/register
 * required: User object
 */
router.post('/register', nameEmailPasswordValidation,
    (req, res) => {

        let helper = new helperMethods();
        let errors = validationResult(req);
        let messageValidationError = helper.identifyErrors(errors, res);
        if (messageValidationError)
            return messageValidationError;


        let newUser = new User(req.body);
        //has password code on bcrypt
        newUser.password = bcrypt.hashSync(req.body.password, 10);
        //fields are not empty
        newUser.save().then((userObj) => {
            return res.json({
                status: true,
                message: "User registered successfully!",
                result: userObj,
            });
        }).catch((e) => {
            //error code for duplicate key is 11000, response status code for duplicate key is 409
            if (e.code == 11000) {
                message = "";
                return res.json({
                    status: false,
                    message: "Email already in use! please use another email.",
                    result: e,
                });
            }
            return res.json({
                status: false,
                message: "Failed to register the user!",
                result: e,
            });
        });
    });

/**
 * LOGIN 
 * Method : Post
 * required: email, password
 * Url: /users/login
 */

router.post('/login', emailAndPasswordValidation,
    (req, res) => {

        let helper = new helperMethods();
        let errors = validationResult(req);
        let messageValidationError = helper.identifyErrors(errors, res);
        if (messageValidationError)
            return messageValidationError;

        //now find by credentials (defined in User model, this is model method)
        User.findByCredentials(req.body.email, req.body.password).then((user) => {
            //user found, so simply we will return the user but in frontend service we will store this user in session
            return res.json({
                status: true,
                message: "User logged in successfully!",
                result: user,
            });

        }).catch((e) => {
            if (e) {
                //400 - bad syntax
                return res.json({
                    status: false,
                    message: "Oops something went wrong!",
                    result: e,
                });
            } else {
                //this means error occure but e = undefined, that means user record not found, that means wrong credentials
                //401 - Unautheraized or wrong credentials
                return res.json({
                    status: false,
                    message: "Wrong Credentials!",
                    result: "User not found!",
                });
            }
        });
    });


//exporting the router
module.exports = router;