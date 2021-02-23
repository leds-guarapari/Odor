'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendMessage = functions.database.ref('/odors/{odorId}').onCreate(async (snapshot) => {
 // initialize odor
 let odor = snapshot.val();
 // initialize payload
 let payload = {
  data: {
   title: odor.Type,
   body: odor.UserName
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