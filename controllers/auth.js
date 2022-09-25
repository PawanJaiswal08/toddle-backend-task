const User = require("./../models/user");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const SignToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 2 * 60 * 60 * 1000, //process.env.JWT_EXPIRES_IN // miliseconds
    });
};

// create token and add it to cookies
const createSendToken = (user, statusCode, req, res) => {
    const token = SignToken(user._id);
    res.cookie(`jwt`, token, {
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        // httpOnly: true,
        // secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });

    // to not send password
    user.password = undefined;

    // return user
    return res.status(statusCode).json({
        status: `OK`,
        token: token,
        data: {
            user,
        },
    });
};

exports.signup = async (req, res, next) => {
    try {
        const { firstname, lastname, email, role, password } = req.body;

        // Validation Results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        // Check If Email already exists
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(422).json({ error: `Email already exists` });
        }

        const newUser = await User.create({
            firstname,
            lastname,
            email,
            role,
            password,
        });

        // Signup Token used for Login Purpose
        createSendToken(newUser, 201, req, res);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // check email and password
        if (!email || !password) {
            return res
                .status(500)
                .json({ error: `Email or Password required` });
        }

        // If email validates it means user logged in using the email else by the Username
        const user = await User.findOne({ email }).select(`+password`);

        if (user && (await user.CheckPass(password, user.password))) {
            createSendToken(user, 200, req, res);
        } else {
            return res
                .status(401)
                .json({ error: `Email and Password do not match` });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

exports.signout = (req, res, next) => {
    res.cookie("jwt", "", {
        expires: new Date(Date.now() + 5 * 1000),
        // httpOnly: true,
    });
    return res.status(200).json({ status: "OK" });
};

// Protecting User not to access non-authorized data
// if he/she is not logged in
exports.protectAccess = async (req, res, next) => {
    try {
        // 1) Get token and checks if it's exist
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith(`Bearer`)
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // check token in cookies
        if (req.cookies.jwt) token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                error: `You are not Logged in! Please Login to get access`,
            });
        }

        // 2) validate if Token is valid
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
        );
        //   console.log(decoded);

        // 3) Check if User still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                error: `The User Belonging to this token does no longer exists !`,
            });
        }

        // 4) Check if User changed Password after the token was issued
        // if (currentUser.PasswordChanged(decoded.iat)) {
        //     return res.status(401).json({
        //         error: `User Recently Changed Password! Please Login Again`,
        //     });
        // }

        // GRANT ACCESS TO PROTECTED ROUTES
        req.user = currentUser;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

// only given array of roles can access data
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array => ['user','tutor']. role = 'user'
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: `You do not have permission to perform this action`,
            });
        }
        next();
    };
};
