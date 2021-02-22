'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendMessage = functions.database.ref('/odors/{odorId}').onCreate((snap) => {
 // initialize odor
 let odor = snap.data().original;
 // initialize message
 let message = {
  data: {
   title: odor.type,
   body: odor.username
  }
 };
 // return send message
 return admin.messaging().send(message);
});
