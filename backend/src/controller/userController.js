const User = require("../model/userModel");
const sendToken = require("../utils/sendToken");

// make user registration function

const userRegistration = async (req, res, next) => {
    try {

        // destructuring of object
        const {
            email,
            password
        } = req.body;

        const user = await User.create({
            email,
            password,
        });
        sendToken(user, 201, res);
    } catch (err) {
        return res.send({
            message: err.message
        });
    }
};

/// make logIn user function

const userLogin = async (req, res, next) => {
   try{
    const {
        email,
        password
    } = req.body;

    // check user enter correct email and password or not
    if (!email || !password) {
        return next(
           res.status(400).send("please enter valid password and email")
        );
    }

    // if user found
    const user = await User.findOne({
        email
    }).select("+password");
    // if user mot found
    if (!user) {
        return next(res.status(401).send("please enter valid email or password"));
    }
    // check password
    const passwordCheck = user.comparePassword(password);
    // notmatch
    if (!passwordCheck) {
        next(res.status(401).send("please enter valid password or email"));
    }
    // match
    sendToken(user, 200, res);
   }
   catch(err){
    return res.send({
        message: err.message
    });
   }
};


module.exports = {
    userRegistration,userLogin
}