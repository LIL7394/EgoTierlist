// =======================
// Firebase setup
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
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// =======================
// Gamemodes and tiers
// =======================
const gamemodes = ["Overall","Sword","Axe","Diapot","UHC","SMP","Vanilla","Nethpot","Mace"];
let currentMode = "Overall";
const tiers = ["HT1","LT1","HT2","LT2","HT3","LT3","HT4","LT4","HT5","LT5"];

// =======================
// Inject gamemode buttons
// =======================
const gamemodeContainer = document.getElementById("gamemode-buttons");
gamemodes.forEach(mode => {
  const btn = document.createElement("button");
  btn.textContent = mode;
  btn.onclick = () => switchMode(mode);
  gamemodeContainer.appendChild(btn);
});

// =======================
// Add player
// =======================
function addItem() {
  const name = document.getElementById("new-item").value.trim();
  const points = document.getElementById("new-points").value.trim();
  if(!name) return alert("Enter player name");
  if(!points || isNaN(points)) return alert("Enter valid points");

  const div = document.createElement("div");
  div.className = "item";
  div.textContent = `${name} (${points} pts)`;
  div.draggable = true;
  div.addEventListener("dragstart", dragStart);
  document.getElementById("LT5-items").appendChild(div);
  document.getElementById("new-item").value = "";
  document.getElementById("new-points").value = "";
}

// =======================
// Drag & Drop
// =======================
function dragStart(e){
  e.dataTransfer.setData("text/plain", e.target.textContent);
  e.dataTransfer.setData("source-id", e.target.parentElement.id);
}

document.querySelectorAll(".items").forEach(container=>{
  container.addEventListener("dragover", e=>e.preventDefault());
  container.addEventListener("drop", e=>{
    e.preventDefault();
    const text = e.dataTransfer.getData("text/plain");
    const sourceId = e.dataTransfer.getData("source-id");
    if(!text) return;
    const sourceContainer = document.getElementById(sourceId);
    const items = Array.from(sourceContainer.children);
    const itemDiv = items.find(i=>i.textContent===text);
    if(itemDiv) sourceContainer.removeChild(itemDiv);
    const newDiv = document.createElement("div");
    newDiv.className="item";
    newDiv.textContent=text;
    newDiv.draggable=true;
    newDiv.addEventListener("dragstart", dragStart);
    e.currentTarget.appendChild(newDiv);
  });
});

// =======================
// Save / Load
// =======================
function saveTierList(){
  const data={};
  tiers.forEach(t=>{
    const container = document.getElementById(t+"-items");
    data[t]=Array.from(container.children).map(c=>c.textContent);
  });
  db.ref("tiers/"+currentMode).set(data)
    .then(()=>alert(`${currentMode} saved!`))
    .catch(err=>alert("Error: "+err));
}

function loadTierList(){
  db.ref("tiers/"+currentMode).get()
    .then(snapshot=>{
      if(!snapshot.exists()) return;
      const data = snapshot.val();
      tiers.forEach(t=>{
        const container = document.getElementById(t+"-items");
        container.innerHTML="";
        data[t].forEach(text=>{
          const div=document.createElement("div");
          div.className="item";
          div.textContent=text;
          div.draggable=true;
          div.addEventListener("dragstart", dragStart);
          container.appendChild(div);
        });
      });
    }).catch(err=>console.error(err));
}

// =======================
// Switch gamemode
// =======================
function switchMode(mode){
  currentMode=mode;
  loadTierList();
  document.querySelectorAll("#gamemode-buttons button").forEach(btn=>{
    btn.classList.toggle("active", btn.textContent===mode);
  });
}

// =======================
// Auto-load default
// =======================
window.onload = () => {
  loadTierList();
  switchMode(currentMode);
};
