'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendMessage = functions.database.ref('/odors/{odorId}').onCreate((snapshot) => {
 // initialize odor
 let odor = snapshot.val();
 // initialize message
 let payload = {
  notification: {
   title: odor.type,
   body: odor.username
  }
 };
 console.log(payload);
 // return send message
 // return admin.messaging().send(payload);
 return Promise.resolve();
});