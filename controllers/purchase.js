const Order = require('../models/orders');
const Razorpay = require('razorpay');
require('dotenv').config();

exports.purchasePremium = async (req, res, next) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        console.log('key_id = ' + rzp.key_id);
        console.log('key_secret = ' + rzp.key_secret);

        const amount = 15000;

        // Order creation
        const order = await rzp.orders.create({ amount, currency: 'INR' });
        // Creating an order for the user
        const userOrder = await req.user.createOrder({ orderid: order.id, status: 'PENDING' });

        return res.status(201).json({ order, key_id: rzp.key_id, userOrder });
    }
    catch (err) {
        console.log('purchasePremium err = ' + JSON.stringify(err));
    }
}//purchasePremium

exports.updateTransactionstatus = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;

        const orderBeforeUpdate = await Order.findOne({ where: { orderid: order_id } });
        console.log('orderBeforeUpdate:', orderBeforeUpdate.toJSON());

        const userBeforeUpdate = await req.user.reload(); // Reload the user to get the latest data
        console.log('userBeforeUpdate:', userBeforeUpdate.toJSON());

        const promise1 = orderBeforeUpdate.update({ paymentid: payment_id, status: 'SUCCESSFUL' });

        // Assuming your user object is available in req.user
        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const promise2 = req.user.update({ ispremiumuser: true });

        Promise.all([promise1, promise2]).then(async() => {
            const orderAfterUpdate = await Order.findOne({ where: { orderid: order_id } });
            console.log('orderAfterUpdate:', orderAfterUpdate.toJSON());

            const userAfterUpdate = await req.user.reload();
            console.log('userAfterUpdate:', userAfterUpdate.toJSON());

            return res.status(202).json({ success: true, message: 'Transaction Successful' });
        })
            .catch(async (err) => {
                // await order.update({ paymentid: payment_id, status: 'FAILED' });

                const orderAfterFailedUpdate = await Order.findOne({ where: { orderid: order_id } });
                console.log('orderAfterFailedUpdate:', orderAfterFailedUpdate.toJSON());

                return res.status(500).json({ success: false, message: 'Transaction Failed' });
            });


        // const { payment_id, order_id } = req.body;

        // const order = await Order.findOne({ where: { orderid: order_id } });
        // console.log('find one = ' + order.toJSON());

        // const userBeforeUpdate = await req.user.reload(); // Reload the user to get the latest data
        // console.log('userBeforeUpdate:', userBeforeUpdate.toJSON());

        // const promise1 = order.update({ paymentid: payment_id, status: "SUCCESSFUL" });
        // console.log('update order = ' + promise1.toJSON());

        // // Assuming your user object is available in req.user
        // if (!req.user) {
        //     return res.status(404).json({ success: false, message: 'User not found' });
        // }

        // const promise2 = req.user.update({ ispremiumuser: true })
        // console.log('update user = ' + promise2.toJSON());

        // Promise.all([promise1, promise2]).then(() => {

        //     return res.status(202).json({ success: true, message: 'Transaction Successful' });
        // })
        //     .catch(async (err) => {
        //         await order.update({ paymentid: payment_id, status: "FAILED" });

        //         return res.status(500).json({ success: false, message: 'Transaction Failed' });
        //     })
    }

    catch (err) {
        console.log('updateTransactionstatusF err = ' + err);
    }
}//updateTransactionstatus
