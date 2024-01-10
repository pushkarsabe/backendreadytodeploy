const User = require('../models/user');
const ForgotPassword = require('../models/ForgotPasswordRequests');
const bcrypt = require('bcrypt');

// send in blue 
const Sib = require('sib-api-v3-sdk')
require('dotenv').config();
//unique id 
const { v4: uuidv4 } = require('uuid');

//this will check if email exists or not 
exports.getUserDeatils = async (req, res, next) => {
    //to send email from backend server to send password to the user
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    //set as your project sender email 
    const sender = {
        email: 'pushkarsabe@gmail.com',
    }
    //set it up as your users email
    const receivers = [
        {
            email: 'sabepushkar@gmail.com'
        },
    ]

    try {
        const uid = uuidv4();
        const userEmail = req.body.email;
        console.log('getUserDeatils userEmail = ' + userEmail);
        console.log('getUserDeatils uid = ' + uid);

        const userData = await User.findAll({ where: { email: userEmail } });
        console.log('getUserDeatils userData = ' + JSON.stringify(userData));
        console.log('getUserDeatils password = ' + userData[0].password);
        console.log('apiKey = ' + process.env.API_KEY);

        if (userData == undefined || userData == '') {
            return res.status(400).json({ message: `No user with email = ${userEmail}` })
        }

        console.log('getUserDeatils userData = ' + JSON.stringify(userData));

        //to save the data to database
        const forgotPasswordData = ForgotPassword.create({
            id: uid,
            UserId: userData[0].id,
            isactive: true
        })


        //to send the password to the users email
        tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset Password',
            textContent: `Here is your password link`,
            htmlContent: `<a href="http://localhost:3000/password/resetpassword/${uid}">Reset password</a>`,
        })
            .then(console.log())
            .catch(console.log)


        res.status(200).json({ userData: userData, message: `Link to reset password sent to your mail` });
    } catch (err) {
        console.log('getUserDeatils err = ' + err);
        return res.status(400).json({ error: err, message: ' Error inside Getemail' })
    }
}


exports.resetpassword = (req, res) => {
    const id = req.params.id;
    console.log('resetpassword id = ' + id);

    ForgotPassword.findOne({ where: { id } }).then(forgotpasswordrequest => {
        if (forgotpasswordrequest) {
            forgotpasswordrequest.update({ active: false });
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
            )
            res.end()

        }
    })
}

exports.updatepassword = async (req, res) => {

    try {
        const { newpassword } = req.query;
        console.log('updatepassword newpassword = ' + newpassword);
        const { resetpasswordid } = req.params;
        console.log('updatepassword resetpasswordid = ' + resetpasswordid);

        const resetpasswordrequest = await ForgotPassword.findOne({ where: { id: resetpasswordid } })
        console.log('updatepassword resetpasswordrequest = ' + JSON.stringify(resetpasswordrequest));

        const user = await User.findOne({ where: { id: resetpasswordrequest.UserId } })
        console.log('updatepassword user = ' + JSON.stringify(user));

        // console.log('userDetails', user)
        if (user) {
            //encrypt the password
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                    console.log(err);
                    throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function (err, hash) {
                    // Store hash in your password DB.
                    if (err) {
                        console.log(err);
                        throw new Error(err);
                    }
                    console.log('updatepassword new password = ' + hash);

                    user.update({ password: hash }).then(() => {
                        res.status(201).json({ message: 'Successfuly update the new password' })
                    })
                });
            });
        } else {
            return res.status(404).json({ error: 'No user Exists', success: false })
        }

    } catch (error) {
        return res.status(403).json({ error, success: false })
    }

}