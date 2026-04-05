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
// TEST BUTTON
// =======================
function testFirebase() {
  db.ref("test").set({
    message: "Firebase connected!"
  })
  .then(() => alert("Firebase connected!"))
  .catch(err => alert("Error: " + err));
}

// =======================
// GAMEMODES SETUP
// =======================
const gamemodes = ["Overall","Sword","Axe","Diapot","UHC","SMP","Vanilla","Nethpot","Mace"];
let currentMode = "Overall";

// Create buttons dynamically
const nav = document.getElementById("gamemode-buttons");
gamemodes.forEach(mode => {
  const btn = document.createElement("button");
  btn.textContent = mode;
  btn.onclick = () => switchMode(mode);
  nav.appendChild(btn);
});

// =======================
// SWITCH GAMEMODE
// =======================
function switchMode(mode) {
  currentMode = mode;
  loadTierList();
}

// =======================
// ADD PLAYER
// =======================
function addItem() {
  const nameInput = document.getElementById("new-item");
  const pointsInput = document.getElementById("new-points");
  const name = nameInput.value.trim();
  const points = parseInt(pointsInput.value);
  if (!name || isNaN(points)) {
    alert("Enter valid name and points!");
    return;
  }

  // Default add to LT1
  const div = document.createElement("div");
  div.className = "item";
  div.textContent = `${name} - ${points} pts`;
  div.draggable = true;
  div.addEventListener("dragstart", dragStart);
  document.getElementById("LT1-items").appendChild(div);

  nameInput.value = "";
  pointsInput.value = "";
}

// =======================
// DRAG & DROP
// =======================
function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.textContent);
  e.dataTransfer.setData("source-id", e.target.parentElement.id);
}

document.querySelectorAll(".items").forEach(container => {
  container.addEventListener("dragover", e => e.preventDefault());
  container.addEventListener("drop", e => {
    e.preventDefault();
    const text = e.dataTransfer.getData("text/plain");
    const sourceId = e.dataTransfer.getData("source-id");
    if (!text) return;
    const sourceContainer = document.getElementById(sourceId);
    const items = Array.from(sourceContainer.children);
    const itemDiv = items.find(i => i.textContent === text);
    if (itemDiv) sourceContainer.removeChild(itemDiv);
    const newDiv = document.createElement("div");
    newDiv.className = "item";
    newDiv.textContent = text;
    newDiv.draggable = true;
    newDiv.addEventListener("dragstart", dragStart);
    e.currentTarget.appendChild(newDiv);
  });
});

// =======================
// SAVE CURRENT GAMEMODE
// =======================
function saveTierList() {
  const data = {};
  ["HT1-items","LT1-items","HT2-items","LT2-items","HT3-items","LT3-items","HT4-items","LT4-items","HT5-items","LT5-items"]
    .forEach(id => {
      const container = document.getElementById(id);
      data[id] = Array.from(container.children).map(c => c.textContent);
    });
  db.ref("tierlist/" + currentMode).set(data)
    .then(() => alert(`${currentMode} saved!`))
    .catch(err => alert("Error: " + err));
}

// =======================
// LOAD CURRENT GAMEMODE
// =======================
function loadTierList() {
  db.ref("tierlist/" + currentMode).get()
    .then(snapshot => {
      const data = snapshot.val();
      ["HT1-items","LT1-items","HT2-items","LT2-items","HT3-items","LT3-items","HT4-items","LT4-items","HT5-items","LT5-items"]
      .forEach(id => {
        const container = document.getElementById(id);
        container.innerHTML = "";
        if (data && data[id]) {
          data[id].forEach(text => {
            const div = document.createElement("div");
            div.className = "item";
            div.textContent = text;
            div.draggable = true;
            div.addEventListener("dragstart", dragStart);
            container.appendChild(div);
          });
        }
      });
    })
    .catch(err => console.error(err));
}

// =======================
// AUTO LOAD ON PAGE OPEN
// =======================
window.onload = () => loadTierList();
