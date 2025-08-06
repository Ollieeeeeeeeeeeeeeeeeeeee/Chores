const users = ["Ollie", "Charlie"];
const chores = {
  "dishwasher": { name: "Do the dishwasher", times: 2 },
  "bed": { name: "Make your bed", times: 1 },
  "tidy": { name: "Tidy your room", times: 0.5 } // sometimes
};

let currentUser = null;

function setUser(user) {
  currentUser = user;
  document.getElementById("user-select").style.display = "none";
  document.getElementById("main").style.display = "block";
  document.getElementById("welcome").textContent = `Hi ${user}!`;

  if (!localStorage.getItem("assignedChores") || isNewDay()) {
    assignChores();
  }

  loadChores();
}

function isNewDay() {
  const last = localStorage.getItem("lastAssigned");
  const today = new Date().toISOString().split('T')[0];
  return last !== today;
}

function assignChores() {
  const today = new Date().toISOString().split('T')[0];
  let assignments = {};

  users.forEach(user => {
    let choresList = [];
    Object.keys(chores).forEach(key => {
      let count = chores[key].times;
      if (key === "tidy") {
        if (Math.random() < 0.33) count = 1;
        else count = 0;
      }
      for (let i = 0; i < count; i++) {
        choresList.push(chores[key].name);
      }
    });
    assignments[user] = choresList;
  });

  localStorage.setItem("assignedChores", JSON.stringify(assignments));
  localStorage.setItem("completed", JSON.stringify({}));
  localStorage.setItem("lastAssigned", today);
}

function loadChores() {
  const assignments = JSON.parse(localStorage.getItem("assignedChores"));
  const completed = JSON.parse(localStorage.getItem("completed")) || {};
  const userChores = assignments[currentUser] || [];

  const form = document.getElementById("chore-form");
  form.innerHTML = "";

  let done = completed[currentUser] || [];

  userChores.forEach((task, idx) => {
    const id = `chore-${idx}`;
    const checked = done.includes(task) ? "checked disabled" : "";
    form.innerHTML += `
      <label>
        <input type="checkbox" ${checked} onchange="completeChore('${task}')"> ${task}
      </label>
    `;
  });

  updateReward();
}

function completeChore(task) {
  let completed = JSON.parse(localStorage.getItem("completed")) || {};
  if (!completed[currentUser]) completed[currentUser] = [];
  if (!completed[currentUser].includes(task)) {
    completed[currentUser].push(task);
  }
  localStorage.setItem("completed", JSON.stringify(completed));
  loadChores();
}

function updateReward() {
  let completed = JSON.parse(localStorage.getItem("completed")) || {};
  const count = (completed[currentUser] || []).length;
  document.getElementById("reward").textContent = count * 10;
}

function resetDay() {
  localStorage.removeItem("assignedChores");
  localStorage.removeItem("completed");
  setUser(currentUser);
}

function logout() {
  location.reload();
}
