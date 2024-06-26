const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const path = require("path");
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: path.join(__dirname, "..", ".env") });
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "noreply.carrentalapp@gmail.com",
        pass: process.env.MAIL_PASSWORD
    }
});

module.exports = {
    sendVerificationLink: async (id, email, name) => {
        const token = jwt.sign({
            data: { userid: id, name: name, email: email },
            exp: Math.floor(Date.now() / 1000) + (60 * 60) 
        }, process.env.ACCESS_TOKEN_SECRET);
        const mailOptions = {
            from: "noreply.crsapp@gmail.com",
            to: `${email}`,
            subject: "Verify your email",
            html: `
                    <p>Hi ${name}, please click on the following link to verify your email</p>
                    <a href = "http://${process.env.DOMAIN}/auth/verify/${token}">Verify your email</a>
                  `
        };
        await transporter.sendMail(mailOptions);
        return;
    },
    sendPasswordResetEmail: async (id, email, name) => {
        const token = jwt.sign({ 
            data: { userid: id, name: name, email: email },
            exp: Math.floor(Date.now() / 1000) + (60 * 60) 
        }, process.env.ACCESS_TOKEN_SECRET);
        const mailOptions = {
            from: "noreply.crsapp@gmail.com",
            to: `${email}`,
            subject: "Reset your password",
            html: `
                    <p>Hi ${name}, please click on the following link to reset your password</p>
                    <a href = "http://${process.env.DOMAIN}/auth/reset/${token}">Change your password</a>
                  `
        };
        await transporter.sendMail(mailOptions);
        return;
    }
}