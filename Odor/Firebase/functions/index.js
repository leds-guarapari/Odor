'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendMessage = functions.database.ref('/odors/{odorId}').onCreate((snapshot) => {
 // initialize odor
 let odor = snapshot.val();
 // initialize payload
 let payload = {
  data: {
   title: odor.Type,
   body: odor.UserName
  }
 };
 console.log(payload);
 // initialize tokens
 let tokens;
 // get list of device notification tokens
 await admin.database().ref('/tokens').once('value').then((result) => {
  tokens = Object.keys(result.val());
 });
 console.log(tokens);
 // return send message
 // return admin.messaging().sendToDevice(tokens, payload);
 return Promise.resolve();
});