'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Configure the email transport using the default SMTP transport and a Gmail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email`, `gmail.password` and `gmail.to` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const gmailTo = functions.config().gmail.to;
const mailTransport = nodemailer.createTransport({
 service: 'gmail',
 auth: {
  user: gmailEmail,
  pass: gmailPassword,
 },
});

admin.initializeApp();

exports.sendMessage = functions.database.ref('/odors/{odorId}').onCreate(async (snapshot) => {
 // initialize odor
 let odor = snapshot.val();
 // initialize payload
 let payload = {
  data: {
   title: odor.Type,
   body: odor.Address
  }
 };
 // initialize tokens
 let tokens = [];
 // get list of device notification tokens
 await admin.database().ref('/tokens').once('value').then((result) => {
  // verify result
  if (result.hasChildren()) {
   // listing all tokens as an array
   tokens = Object.keys(result.val());
  }
 });
 // verify tokens
 if (tokens.length) {
  // send notifications to all tokens
  let response = await admin.messaging().sendToDevice(tokens, payload);
  // initialize removes
  let removes = [];
  // for each message check if there was an error
  response.results.forEach((result, index) => {
   // initialize error
   let error = result.error;
   // verify error
   if (error) {
    // cleanup the tokens who are not registered anymore
    if (error.code === 'messaging/invalid-registration-token' ||
     error.code === 'messaging/registration-token-not-registered') {
     // push remove promise
     removes.push(admin.database().ref('/tokens').child(tokens[index]).remove());
    }
   }
  });
  // dispatch all removes
  return Promise.all(removes);
 } else {
  // resolve promise
  return Promise.resolve();
 }
});

exports.sendMail = functions.database.ref('/odors/{odorId}').onCreate(async (snapshot) => {
 // initialize odor
 let odor = snapshot.val();
 // initialize mail options
 let mailOptions = {
  from: `Odor <${gmailEmail}>`,
  to: gmailTo,
  subject: odor.Type,
  text: odor.Address,
 };
 // send mail
 await mailTransport.sendMail(mailOptions);
 // resolve promise
 return Promise.resolve();
});