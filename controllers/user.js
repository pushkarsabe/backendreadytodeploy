//importing error to handle it
const User = require('../models/user');
const Expense = require('../models/expense');
//to hash the user password
const bcrypt = require('bcrypt');
//to send jwt from backend to frontend or reverse
const jwt = require('jsonwebtoken');


//to post the records to database
exports.postAddUser = async (req, res, next) => {
    try {
        //post always uses body
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        console.log('name = ' + name);
        console.log('email = ' + email);
        console.log('password = ' + password);
        if (name == '' || name == undefined || email == '' || email == undefined || password == '' || password == undefined) {
            return res.status(401).json({ meassage: 'Input fields are empty' })
        }

        //number of hashing or strengthen
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            console.log('err = ' + err);
            console.log('hash = ' + hash);

            const newUser = await User.create({
                name: name,
                email: email,
                password: hash,
            });

            res.status(201).json({ newUserDetails: newUser, meassage: ' SignUpSuccessful' });
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err })
    }

}//postAddUser

//to get the records from db
exports.postLoginUser = async (req, res, next) => {
    //get always uses param
    const email = req.body.email;
    const password = req.body.password;
    console.log('postLoginUser email = ' + email);
    console.log('postLoginUser password = ' + password);

    if (email == '' || email == undefined || password == '' || password == undefined) {
        return res.status(400).json({ success: false, message: 'Input fields required' });
    }

    const userData = await User.findAll({
        where: { email: email }
    })
    if (userData.length == 0) {
        return res.status(400).json({ success: false, message: 'Email not found' });
    }

    const getUserData = userData[0];
    console.log('postLoginUser userData = ' + JSON.stringify(userData));
    console.log('postLoginUser user id = ' + getUserData.id);
    console.log('postLoginUser user password = ' + getUserData.password);
    console.log('postLoginUser user name = ' + getUserData.name);
    console.log('postLoginUser user ispremiumuser = ' + getUserData.ispremiumuser);

    bcrypt.compare(password, getUserData.password, (err, response) => {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Something went wrong' });
        }
        if (response) {
            //will send json response back to the client
            res.status(201).json({ success: true, userDetails: userData, token: generateAccessToken(getUserData.id, getUserData.name, getUserData.ispremiumuser), message: 'Successfully Logged In' });
        }
        else {
            return res.status(400).json({ success: false, message: 'Password do not match' });
        }
    });
}

function generateAccessToken(id, name, ispremiumuser) {
    return jwt.sign({ userid: id, name: name, ispremiumuser }, 'secretkey');
}
