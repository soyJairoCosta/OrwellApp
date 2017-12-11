const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.disableNewUsers = functions.auth.user().onCreate( event => {
    admin.auth().updateUser(event.data.uid, {disabled:true});
});