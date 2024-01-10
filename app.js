const express = require('express');
const bodyParser = require('body-parser');
//to avoid cross origin comm error
const cors = require('cors');
//to secure requests 
const helmet = require('helmet');
//compression generally refers to the process of compressing data or files
const compression = require('compression');
//HTTP request logger middleware for node.js ,it provides a simple and configurable way to log HTTP requests and responses in your server application. 
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sequelize = require('./util/database');

//to write all the logs inside one file 
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
)

const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

const userRoute = require('./routes/user');
const expenseRoute = require('./routes/expense');
const purchaseRoute = require('./routes/purchase');
const premiumRoute = require('./routes/premium');
const forgotpasswordRoute = require('./routes/forgotpassword');

const User = require('./models/user');
const Order = require('./models/orders');
const ForgotPassword = require('./models/ForgotPasswordRequests');
const DownloadExpense = require('./models/downloadExpense');

//parse application
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

//to call user 
app.use('/user', userRoute);

//to call expense 
app.use('/expense', expenseRoute);

//to call purchase 
app.use('/purchase', purchaseRoute);

//to call premium 
app.use('/premium', premiumRoute);

//to call forgot password 
app.use('/password', forgotpasswordRoute);

//apart from predefined routes if user hits anything then login page will popup 
app.use((req, res) => {
  console.log('request = ' + req.url);
  res.sendFile(path.join(__dirname, `FontEnd Files/${req.url}`));
})


//to show the FK relationship
User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(DownloadExpense);
DownloadExpense.belongsTo(User);

//this will update the new column added into model into user table
// User.sync({ alter: true })
//   .then(() => {
//     console.log('Model synced successfully');
//   })
//   .catch((error) => {
//     console.error('Error syncing model:', error);
//   });

// this will create tabble
sequelize
  .sync()
  .then(result => {
    // console.log(result);
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });


