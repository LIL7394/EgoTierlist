// Firebase config
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

function addItem() {
  const input = document.getElementById("new-item");
  const val = input.value.trim();
  if (!val) return;
  const div = document.createElement("div");
  div.className = "item";
  div.textContent = val;
  div.draggable = true;
  div.addEventListener("dragstart", dragStart);
  document.getElementById("B-items").appendChild(div);
  input.value = "";
}

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

function saveTierList() {
  const data = {};
  ["S-items", "A-items", "B-items"].forEach(id => {
    const container = document.getElementById(id);
    data[id] = Array.from(container.children).map(c => c.textContent);
  });
  db.ref("tierlist").set(data)
    .then(() => alert("Tier list saved!"))
    .catch(err => alert("Error: " + err));
}

function loadTierList() {
  db.ref("tierlist").get().then(snapshot => {
    if (!snapshot.exists()) return;
    const data = snapshot.val();
    ["S-items", "A-items", "B-items"].forEach(id => {
      const container = document.getElementById(id);
      container.innerHTML = "";
      data[id].forEach(text => {
        const div = document.createElement("div");
        div.className = "item";
        div.textContent = text;
        div.draggable = true;
        div.addEventListener("dragstart", dragStart);
        container.appendChild(div);
      });
    });
  }).catch(err => console.error(err));
}

window.onload = loadTierList;
