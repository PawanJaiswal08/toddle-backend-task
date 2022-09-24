const express = require(`express`);
const router = express.Router();

const { check } = require(`express-validator`);
const { signup, signin, signout } = require(`./../controllers/auth`);

// @desc Register a User ( SignUp )
// @access Public
router.post(
    `/signup`,
    // Middlewares to check basic validation of name, lastname, email and password
    [
        check(`firstname`, `Firstname must be more than 2 char`).isLength({
            min: 2,
        }),
        check(`lastname`, `Lastname must be more than 2 char`).isLength({
            min: 2,
        }),
        check(`email`, `Invalid Email`).isEmail(),
        check(`role`, `Invalid Role`).isIn([`student`, `tutor`]),
        check(
            `password`,
            `Please enter a password at least 8 character 
                            and contain At least one uppercase.At least 
                            one lower case.At least one special character.`
        )
            .isLength({ min: 8 })
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
    ],

    signup
);

// @desc Signin a User ( Signin )
// @access Public
router.post(
    `/signin`,
    // Middlewares to check basic validation of email and password
    [
        check(`email`, `Invalid Email`).isEmail(),
        check(`password`, `Password is required`).isLength({ min: 1 }),
    ],

    signin
);

// @desc SignOut a User ( Signout )
// @access Public
router.get(`/signout`, signout);

module.exports = router;
