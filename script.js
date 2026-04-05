// =======================
// FIREBASE SETUP
// =======================

const firebaseConfig = {
  apiKey: "AIzaSyBx53SCnYUsr4C_OJemMh11L_sYKL_RWf0",
  authDomain: "tierlist-7c74a.firebaseapp.com",
  databaseURL: "https://tierlist-7c74a-default-rtdb.firebaseio.com",
  projectId: "tierlist-7c74a",
  storageBucket: "tierlist-7c74a.appspot.com",
  messagingSenderId: "230727654744",
  appId: "1:230727654744:web:92ef0175baaa5d10c8592d"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// =======================
// TEST (VERY IMPORTANT)
// =======================

function testFirebase() {
  db.ref("test").set({
    message: "it works"
  })
  .then(() => alert("Firebase connected!"))
  .catch(err => alert("Error: " + err));
}
