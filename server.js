// Twilio config.
var twilioAccountSID = 'AC017f38a2339d6a5134f7a3e900068640';
var twilioAuthToken = '861984045630765a5250be9033b2a1a4';
var twilioNumber = '+16502784972';

// Firebase config.
var firebaseServiceAccount = 'serverAccountCredentials.json'; 
var firebaseDatabaseUrl = 'https://project1-47c7a.firebaseio.com';

// // Mailgun config.
// var mailgunApiKey = '';
// var mailgunDomain = '';

// Create references for libraries.
var express = require('express');
var http = require('http');
var firebase = require('firebase');
var twilio = require('twilio');
// var mailgun = require('mailgun-js')({apiKey: mailgunApiKey, domain: mailgunDomain});

// Express server setup.
var router = express();
var server = http.createServer(router);
var twilioClient = twilio(twilioAccountSID, twilioAuthToken);

// Initialize Firebase.
firebase.initializeApp({
  serviceAccount: firebaseServiceAccount,
  databaseURL: firebaseDatabaseUrl
});

// Create a Firebase database instance.
var db = firebase.database();

// Create a reference to textMessages.
var textMessagesRef = db.ref("textMessages");

// // Listen for new objects pushed to textMessagesRef.
textMessagesRef.on("child_added", function(snapshot) {
  var textMessageKey = snapshot.key;
  var textMessage = snapshot.val();
  twilioClient.messages.create({
    body: 'FROM Heroku: ' + 'Hi ' + textMessage.name + '! Your table for ' + textMessage.size + ' is now ready!',
    to: textMessage.phoneNumber,
    from: twilioNumber
  }, function(err, message) {
    if (err) {
      console.log(err);
    } else {
      console.log(message);
      textMessagesRef.child(textMessageKey).remove();
    }
  });
});

// // Create a reference to emails.
// var emailsRef = db.ref('emails');

// // Listen for new objects pushed to emailsRef.
// emailsRef.on("child_added", function(snapshot) {
//   var email = snapshot.val();
//   var emailKey = snapshot.key;
//   var emailData = {
//     from: '<postmaster@'  + mailgunDomain + '>',
//     to: email.emailAddress,
//     subject: 'Welcome to Wait and Eat',
//     text: 'Thanks for signing up for Wait and Eat!'
//   };
//   mailgun.messages().send(emailData, function(error, body) {
//     console.log(body);
//     emailsRef.child(emailKey).remove();
//     if (error) {
//       console.log(error);
//     }
//   });
// });


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});