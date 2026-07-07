const MAX_PLAYERS = 20;
const SORT_DELAY_MS = 2000;
const SORT_TICK_MS = 100;

const scoringButtons = [
  { label: "-4", value: -4, className: "ball-penalty" },
  { label: "-1", value: -1, className: "ball-penalty" },
  { label: "+1", value: 1, className: "ball-red" },
  { label: "+2", value: 2, className: "ball-yellow" },
  { label: "+3", value: 3, className: "ball-green" },
  { label: "+4", value: 4, className: "ball-brown" },
  { label: "+5", value: 5, className: "ball-blue" },
  { label: "+6", value: 6, className: "ball-pink" },
  { label: "+7", value: 7, className: "ball-black" },
];

const form = document.querySelector("[data-player-form]");
const input = document.querySelector("[data-player-input]");
const error = document.querySelector("[data-form-error]");
const count = document.querySelector("[data-player-count]");
const list = document.querySelector("[data-player-list]");
const emptyState = document.querySelector("[data-empty-state]");
const sortStatus = document.querySelector("[data-sort-status]");

let players = [];
let nextPlayerId = 1;
let sortTimer = null;
let sortTargetTime = 0;

function setError(message = "") {
  error.textContent = message;
}

function updateLimitState() {
  const atLimit = players.length >= MAX_PLAYERS;
  input.disabled = atLimit;
  form.querySelector("button[type='submit']").disabled = atLimit;
  input.placeholder = atLimit ? "Maximal 20 Spieler erreicht" : "Spielername";
  count.textContent = `${players.length}/${MAX_PLAYERS}`;
}

function sortByName() {
  players.sort((a, b) => a.name.localeCompare(b.name, "de"));
}

function sortByScore() {
  players.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }

    return a.name.localeCompare(b.name, "de");
  });
}

function createButton({ label, value, className }, player) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `score-button ${className}`;
  button.textContent = label;
  button.setAttribute("aria-label", `${label} Punkte fuer ${player.name}`);
  button.addEventListener("click", () => updateScore(player.id, value));
  return button;
}

function createDeleteButton(player) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "delete-button";
  button.textContent = "x";
  button.setAttribute("aria-label", `${player.name} loeschen`);
  button.addEventListener("click", () => deletePlayer(player.id));
  return button;
}

function renderPlayer(player, index) {
  const card = document.createElement("article");
  card.className = "player-card";

  const main = document.createElement("div");
  main.className = "player-main";

  const rank = document.createElement("span");
  rank.className = "player-rank";

  if (index === 0) {
    const crown = document.createElement("img");
    crown.className = "crown";
    crown.src = "/crown.svg";
    crown.alt = "";
    crown.setAttribute("aria-hidden", "true");
    rank.append(crown);
  }

  rank.append(`${index + 1}. Platz`);

  const name = document.createElement("h3");
  name.className = "player-name";
  name.textContent = player.name;

  const controls = document.createElement("div");
  controls.className = "score-controls";
  controls.append(createDeleteButton(player));
  scoringButtons.forEach((buttonConfig) => {
    controls.append(createButton(buttonConfig, player));
  });

  main.append(rank, name, controls);

  const score = document.createElement("div");
  score.className = "player-score";

  const scoreValue = document.createElement("span");
  scoreValue.className = "score-value";
  scoreValue.textContent = player.score;

  const scoreLabel = document.createElement("span");
  scoreLabel.className = "score-label";
  scoreLabel.textContent = "Punkte";

  score.append(scoreValue, scoreLabel);
  card.append(main, score);
  return card;
}

function render() {
  list.replaceChildren();
  players.forEach((player, index) => {
    list.append(renderPlayer(player, index));
  });

  emptyState.hidden = players.length > 0;
  updateLimitState();
}

function addPlayer(name) {
  players.push({
    id: nextPlayerId,
    name,
    score: 0,
  });
  nextPlayerId += 1;
  sortByName();
  render();
}

function deletePlayer(id) {
  players = players.filter((player) => player.id !== id);
  render();
  input.focus();
}

function updateScore(id, change) {
  const player = players.find((candidate) => candidate.id === id);
  if (!player) {
    return;
  }

  player.score += change;
  render();
  scheduleSort();
}

function updateSortStatus() {
  const remainingMs = Math.max(0, sortTargetTime - Date.now());
  sortStatus.hidden = false;
  sortStatus.textContent = `Sortierung in ${(remainingMs / 1000).toFixed(1)} s`;
}

function clearSortTimer() {
  if (sortTimer) {
    clearInterval(sortTimer);
    sortTimer = null;
  }
}

function scheduleSort() {
  clearSortTimer();
  sortTargetTime = Date.now() + SORT_DELAY_MS;
  updateSortStatus();

  sortTimer = setInterval(() => {
    if (Date.now() >= sortTargetTime) {
      clearSortTimer();
      sortByScore();
      render();
      sortStatus.hidden = true;
      sortStatus.textContent = "";
      return;
    }

    updateSortStatus();
  }, SORT_TICK_MS);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = input.value.trim();

  if (!name) {
    setError("Bitte gib einen Spielernamen ein.");
    input.focus();
    return;
  }

  if (players.length >= MAX_PLAYERS) {
    setError("Es koennen maximal 20 Spieler teilnehmen.");
    return;
  }

  setError();
  addPlayer(name);
  input.value = "";
  input.focus();
});

render();
