'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendMessage = functions.database.ref('/odors/{odorId}').onCreate((snapshot) => {
 // initialize odor
 let odor = snapshot.val();
 // initialize message
 let message = {
  data: {
   title: odor.type,
   body: odor.username
  },
  topic: 'Odor'
 };
 // return send message
 return admin.messaging().send(message);
});