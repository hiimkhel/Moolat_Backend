require("dotenv").config();  // Make sure dotenv is configured

const admin = require("firebase-admin");

// Check if environment variables are loaded correctly


const serviceAccount = require("./config/serviceAccountKey.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "moolat-firebase-database.appspot.com",
});

const db = admin.firestore();
const auth = admin.auth();
const bucket = admin.storage().bucket();

module.exports = { db, bucket, auth };
