// =======================
// Firebase configuration
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
// Gamemodes setup
// =======================
const gamemodes = ["Sword", "Crystal", "Diapot", "Parkour", "Bedwars", "Skyblock"];
let currentMode = gamemodes[0];

// =======================
// Tier IDs
// =======================
const tiers = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"];

// =======================
// Initialize gamemode buttons
// =======================
const gamemodeContainer = document.createElement("div");
gamemodeContainer.id = "gamemode-buttons";
document.body.insertBefore(gamemodeContainer, document.getElementById("tiers"));

gamemodes.forEach(mode => {
  const btn = document.createElement("button");
  btn.textContent = mode;
  btn.onclick = () => switchMode(mode);
  gamemodeContainer.appendChild(btn);
});

// =======================
// Add item to a tier
// =======================
function addItem() {
  const input = document.getElementById("new-item");
  const pointsInput = document.getElementById("new-points");
  const val = input.value.trim();
  const pts = pointsInput.value.trim();
  if (!val) return alert("Enter a player name!");
  if (!pts || isNaN(pts)) return alert("Enter valid points!");

  const div = document.createElement("div");
  div.className = "item";
  div.textContent = `${val} (${pts} pts)`;
  div.draggable = true;
  div.addEventListener("dragstart", dragStart);

  document.getElementById("LT5-items").appendChild(div); // default new players go to lowest tier
  input.value = "";
  pointsInput.value = "";
}

// =======================
// Drag and Drop
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
// Save/Load per gamemode
// =======================
function saveTierList() {
  const data = {};
  tiers.forEach(t => {
    const container = document.getElementById(t + "-items");
    data[t] = Array.from(container.children).map(c => c.textContent);
  });

  db.ref("tiers/" + currentMode).set(data)
    .then(() => alert(`Tierlist for ${currentMode} saved!`))
    .catch(err => alert("Error: " + err));
}

function loadTierList() {
  db.ref("tiers/" + currentMode).get()
    .then(snapshot => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      tiers.forEach(t => {
        const container = document.getElementById(t + "-items");
        container.innerHTML = "";
        data[t].forEach(text => {
          const div = document.createElement("div");
          div.className = "item";
          div.textContent = text;
          div.draggable = true;
          div.addEventListener("dragstart", dragStart);
          container.appendChild(div);
        });
      });
    })
    .catch(err => console.error(err));
}

// =======================
// Switch Gamemode
// =======================
function switchMode(mode) {
  currentMode = mode;
  loadTierList();
  document.querySelectorAll("#gamemode-buttons button").forEach(btn => {
    btn.style.background = (btn.textContent === mode) ? "#ffdd57" : "#444";
  });
}

// =======================
// Auto-load default mode
// =======================
window.onload = () => {
  // Create points input
  const pointsInput = document.createElement("input");
  pointsInput.id = "new-points";
  pointsInput.placeholder = "Points";
  pointsInput.style.marginRight = "5px";
  document.body.insertBefore(pointsInput, document.getElementById("new-item"));

  loadTierList();
  switchMode(currentMode);
};
