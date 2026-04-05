// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let currentMode = 'sword';

// Switch Gamemode
function switchMode(mode){
  currentMode = mode;
  document.querySelectorAll('#gamemodes button').forEach(b => b.classList.remove('active'));
  document.querySelector(`#gamemodes button[onclick="switchMode('${mode}')"]`).classList.add('active');
  loadTierList();
}

// Add Player
function addPlayer(){
  const name = document.getElementById('player-name').value.trim();
  const points = parseInt(document.getElementById('player-points').value);
  if(!name || isNaN(points)) return;

  const tierId = assignTier(points);
  const container = document.getElementById(`${tierId}-items`);
  const div = document.createElement('div');
  div.className = 'item';
  div.innerHTML = `<span class="name">${name}</span><span class="points">${points}</span>`;
  div.draggable = true;
  div.addEventListener('dragstart', dragStart);
  container.appendChild(div);

  document.getElementById('player-name').value = '';
  document.getElementById('player-points').value = '';
}

// Assign Tier based on points
function assignTier(points){
  if(points >= 900) return 'HT1';
  if(points >= 800) return 'HT2';
  if(points >= 700) return 'HT3';
  if(points >= 600) return 'HT4';
  if(points >= 500) return 'HT5';
  if(points >= 400) return 'LT1';
  if(points >= 300) return 'LT2';
  if(points >= 200) return 'LT3';
  if(points >= 100) return 'LT4';
  return 'LT5';
}

// Drag & Drop
function dragStart(e){
  e.dataTransfer.setData('text/plain', e.target.querySelector('.name').textContent);
  e.dataTransfer.setData('source-id', e.target.parentElement.id);
}

document.querySelectorAll('.items').forEach(container=>{
  container.addEventListener('dragover', e=>e.preventDefault());
  container.addEventListener('drop', e=>{
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    const sourceId = e.dataTransfer.getData('source-id');
    if(!text) return;
    const sourceContainer = document.getElementById(sourceId);
    const items = Array.from(sourceContainer.children);
    const itemDiv = items.find(i => i.querySelector('.name').textContent === text);
    if(itemDiv) sourceContainer.removeChild(itemDiv);
    e.currentTarget.appendChild(itemDiv);
  });
});

// Save & Load per gamemode
function saveTierList(){
  const data = {};
  const tiers = ['HT1','HT2','HT3','HT4','HT5','LT1','LT2','LT3','LT4','LT5'];
  tiers.forEach(id=>{
    const container = document.getElementById(`${id}-items`);
    data[id] = Array.from(container.children).map(c=>({
      name: c.querySelector('.name').textContent,
      points: parseInt(c.querySelector('.points').textContent)
    }));
  });
  db.ref(`tierlists/${currentMode}`).set(data)
    .then(()=>alert('Tierlist saved!'))
    .catch(err=>alert('Error: '+err));
}

function loadTierList(){
  const tiers = ['HT1','HT2','HT3','HT4','HT5','LT1','LT2','LT3','LT4','LT5'];
  db.ref(`tierlists/${currentMode}`).get().then(snapshot=>{
    if(!snapshot.exists()) return;
    const data = snapshot.val();
    tiers.forEach(id=>{
      const container = document.getElementById(`${id}-items`);
      container.innerHTML = '';
      data[id].forEach(p=>{
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<span class="name">${p.name}</span><span class="points">${p.points}</span>`;
        div.draggable = true;
        div.addEventListener('dragstart', dragStart);
        container.appendChild(div);
      });
    });
  }).catch(err=>console.error(err));
}

window.onload = ()=>{
  switchMode('sword');
}
