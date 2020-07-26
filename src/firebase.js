import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAglYd78NY-cE0-vEgJnMJ_BMgRvWkjHXY",
    authDomain: "social-app-c8cdb.firebaseapp.com",
    databaseURL: "https://social-app-c8cdb.firebaseio.com",
    projectId: "social-app-c8cdb",
    storageBucket: "social-app-c8cdb.appspot.com",
    messagingSenderId: "1067795189676",
    appId: "1:1067795189676:web:a8a587035995a3f89ab409"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }