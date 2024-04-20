const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ksudhanshu394@gmail.com',
        pass: 'indian@123',
    },
});

module.exports = transporter;