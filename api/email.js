const express = require("express");
const emailRouter = express.Router();
const nodemailer = require("nodemailer");
const { requireUser } = require("./utils");
const { EMAIL_PASSWORD, EMAIL_USER } = process.env;

//handle email requests here

function testMail() {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    var mail_configs = {
      from: EMAIL_USER,
      to: "thomasjohnso@gmail.com",
      subject: "Testing Nodemailer",
      text: "It works!",
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: "Email failed to send" });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

function sendMail(email, OTP) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    var mail_configs = {
      from: EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `<h1>Reset Password</h1>
        <p>Here is your OTP: ${OTP}</p>`,
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: "Email failed to send" });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

emailRouter.get("/test", async (req, res, next) => {
  testMail()
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

emailRouter.post("/sendOTP", async (req, res, next) => {
  sendMail(req.body.email, req.body.OTP)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

module.exports = emailRouter;
