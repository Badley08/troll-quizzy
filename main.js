// =========================================================
// Quiz de Karlito - Logique Principale (Multi-Thèmes & Modes)
// =========================================================

// Définition des modes et des sources de questions (fichiers JSON modulaires)
const QUIZ_CONFIG = {
  normal: {
    label: "Mode Humour Normal (Bonnes Blagues)",
    themes: [
      {
        id: "all_normal",
        name: "✨ Tous les thèmes (Mix complet)",
        files: [
          "data/blagues_classiques.json",
          "data/devinettes_drole.json",
          "data/humour_quotidien.json",
          "data/jeux_de_mots.json",
          "data/culture_geek_fun.json"
        ]
      },
      {
        id: "blagues",
        name: "😂 Blagues Classiques & Punchlines",
        files: ["data/blagues_classiques.json"]
      },
      {
        id: "devinettes",
        name: "🧩 Devinettes & Énigmes Malines",
        files: ["data/devinettes_drole.json"]
      },
      {
        id: "quotidien",
        name: "☕ Humour du Quotidien & Bureau",
        files: ["data/humour_quotidien.json"]
      },
      {
        id: "jeux_mots",
        name: "🐱 Jeux de Mots & Animaux Farceurs",
        files: ["data/jeux_de_mots.json"]
      },
      {
        id: "geek",
        name: "🎮 Culture Geek, Pop & Dév",
        files: ["data/culture_geek_fun.json"]
      }
    ]
  },
  troll: {
    label: "Mode Troll & Humour Noir (L'original)",
    themes: [
      {
        id: "all_troll",
        name: "😈 Tous les thèmes trolls (Complet)",
        files: ["data/humour_noir_troll.json"]
      }
    ]
  }
};

// Cache en mémoire pour éviter les requêtes réseau répétées
const fileCache = new Map();

// Variables d'état
let currentMode = "normal";
let currentThemeId = "all_normal";
let loadedPool = [];
let shuffledQuestions = [];
let currentQuestion = 0;
let nickname = "";
let totalQuestions = 10;

// Éléments du DOM
const termsPopup = document.getElementById("terms-popup");
const acceptTermsBtn = document.getElementById("acceptTermsBtn");
const chooseNormalBtn = document.getElementById("chooseNormalBtn");
const declineTermsBtn = document.getElementById("declineTermsBtn");

const modeSelect = document.getElementById("modeSelect");
const themeSelect = document.getElementById("themeSelect");
const nicknameInput = document.getElementById("nicknameInput");
const numQuestionsInput = document.getElementById("numQuestionsInput");
const maxQuestionsNotice = document.getElementById("maxQuestionsNotice");
const startQuizBtn = document.getElementById("startQuizBtn");

const progressBar = document.getElementById("progress-bar");
const initialSetup = document.getElementById("initial-setup");
const quizContent = document.getElementById("quiz-content");
const quizEnd = document.getElementById("quiz-end");

const subjectEl = document.getElementById("subject");
const questionTextEl = document.getElementById("questionText");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const finalNickname = document.getElementById("finalNickname");
const restartQuizBtn = document.getElementById("restartQuizBtn");

// Helper d'affichage du pop-up (toujours en flex pour être centré)
function openPopup() {
  if (termsPopup) {
    termsPopup.style.display = "flex";
  }
}

function closePopup() {
  if (termsPopup) {
    termsPopup.style.display = "none";
  }
}

// Charger un fichier JSON avec cache
async function fetchQuestionsFile(filePath) {
  if (fileCache.has(filePath)) {
    return fileCache.get(filePath);
  }
  try {
    const res = await fetch(filePath);
    if (!res.ok) {
      // Fallback spécial pour troll si déplacé
      if (filePath.includes("humour_noir_troll.json")) {
        const fallback = await fetch("questions.json");
        const fbData = await fallback.json();
        fileCache.set(filePath, fbData);
        return fbData;
      }
      throw new Error(`HTTP error ${res.status}`);
    }
    const data = await res.json();
    fileCache.set(filePath, data);
    return data;
  } catch (err) {
    console.error(`Erreur de chargement pour ${filePath}:`, err);
    return [];
  }
}

// Mettre à jour la liste des thèmes (sujets) selon le mode
function updateThemeOptions() {
  const modeData = QUIZ_CONFIG[currentMode];
  if (!modeData) return;

  themeSelect.innerHTML = "";
  modeData.themes.forEach(theme => {
    const opt = document.createElement("option");
    opt.value = theme.id;
    opt.textContent = theme.name;
    themeSelect.appendChild(opt);
  });

  currentThemeId = modeData.themes[0].id;
  themeSelect.value = currentThemeId;
}

// Charger le pool de questions pour le mode et le thème actifs
async function loadQuestionsForCurrentSelection() {
  const modeData = QUIZ_CONFIG[currentMode];
  if (!modeData) return;

  const activeTheme = modeData.themes.find(t => t.id === currentThemeId) || modeData.themes[0];
  let combined = [];

  for (const file of activeTheme.files) {
    const items = await fetchQuestionsFile(file);
    combined = combined.concat(items);
  }

  loadedPool = combined;

  // Mise à jour de la limite de questions dans l'UI
  const maxAvailable = loadedPool.length;
  numQuestionsInput.max = maxAvailable;
  if (maxQuestionsNotice) {
    maxQuestionsNotice.textContent = maxAvailable;
  }

  let val = parseInt(numQuestionsInput.value, 10) || 10;
  if (val > maxAvailable) {
    numQuestionsInput.value = maxAvailable;
  } else if (val < 1 && maxAvailable > 0) {
    numQuestionsInput.value = Math.min(10, maxAvailable);
  }
}

// Remplacement du surnom
function injectNickname(text) {
  if (!text) return "";
  return text.replaceAll("<NICKNAME>", nickname);
}

// Mélange et sélection des questions
function shuffleQuestions() {
  shuffledQuestions = [...loadedPool]
    .sort(() => 0.5 - Math.random())
    .slice(0, totalQuestions);
}

// Affiche la question courante
function loadQuestion() {
  const q = shuffledQuestions[currentQuestion];
  if (!q) {
    showEndScreen();
    return;
  }

  subjectEl.innerText = injectNickname(q.subject || "Question");
  questionTextEl.innerText = injectNickname(q.question);
  feedbackEl.innerText = "";
  feedbackEl.style.display = "none";
  choicesEl.innerHTML = "";

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = injectNickname(choice);
    btn.onclick = () => handleAnswer(choice);
    btn.classList.add("fade-in");
    choicesEl.appendChild(btn);
  });

  animateQuestion();
  updateProgressBar();
}

// Gestion de la réponse
function handleAnswer(choice) {
  const q = shuffledQuestions[currentQuestion];

  // Désactiver les boutons après clic
  Array.from(choicesEl.children).forEach(button => {
    button.disabled = true;
  });

  let feedback = "";
  if (q.feedback && q.feedback[choice]) {
    feedback = injectNickname(q.feedback[choice]);
  } else if (q.answer) {
    feedback = injectNickname(q.answer);
  } else {
    feedback = "Bien noté, <NICKNAME> !";
  }

  feedbackEl.innerText = feedback;
  feedbackEl.style.display = "block";
}

// Animation question
function animateQuestion() {
  questionTextEl.classList.remove("fade-in");
  void questionTextEl.offsetWidth; // trigger reflow
  questionTextEl.classList.add("fade-in");
}

// Mise à jour de la barre de progression
function updateProgressBar() {
  const percent = totalQuestions > 0 ? Math.floor((currentQuestion / totalQuestions) * 100) : 0;
  progressBar.style.width = `${percent}%`;
}

// Question suivante
nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < shuffledQuestions.length) {
    loadQuestion();
  } else {
    showEndScreen();
  }
});

// Fin du quiz
function showEndScreen() {
  quizContent.style.display = "none";
  quizEnd.style.display = "block";
  finalNickname.innerText = nickname;
  progressBar.style.width = "100%";
}

// Recommencer
restartQuizBtn.addEventListener("click", () => {
  currentQuestion = 0;
  quizEnd.style.display = "none";
  initialSetup.style.display = "block";
  updateProgressBar();
});

// Démarrer le quiz
startQuizBtn.addEventListener("click", () => {
  nickname = nicknameInput.value.trim() || "Ami(e) du Rire";
  const userNum = parseInt(numQuestionsInput.value, 10);
  totalQuestions = Math.min(Math.max(1, userNum || 10), loadedPool.length || 10);

  if (loadedPool.length === 0) {
    alert("Chargement des questions en cours... Réessaie dans un instant.");
    return;
  }

  shuffleQuestions();
  currentQuestion = 0;

  initialSetup.style.display = "none";
  quizContent.style.display = "block";
  loadQuestion();
});

// Écouteurs de changement de mode et de thème
modeSelect.addEventListener("change", async (e) => {
  currentMode = e.target.value;
  updateThemeOptions();
  await loadQuestionsForCurrentSelection();

  // Si on choisit le mode troll, rappeler l'avertissement
  if (currentMode === "troll") {
    openPopup();
  }
});

themeSelect.addEventListener("change", async (e) => {
  currentThemeId = e.target.value;
  await loadQuestionsForCurrentSelection();
});

// Événements du Pop-up
if (acceptTermsBtn) {
  acceptTermsBtn.addEventListener("click", () => {
    currentMode = "troll";
    modeSelect.value = "troll";
    updateThemeOptions();
    loadQuestionsForCurrentSelection();
    closePopup();
  });
}

if (chooseNormalBtn) {
  chooseNormalBtn.addEventListener("click", () => {
    currentMode = "normal";
    modeSelect.value = "normal";
    updateThemeOptions();
    loadQuestionsForCurrentSelection();
    closePopup();
  });
}

if (declineTermsBtn) {
  declineTermsBtn.addEventListener("click", () => {
    // Si l'utilisateur refuse le mode troll, lui proposer directement le mode normal
    currentMode = "normal";
    modeSelect.value = "normal";
    updateThemeOptions();
    loadQuestionsForCurrentSelection();
    closePopup();
  });
}

// Initialisation au chargement de la page
window.addEventListener("DOMContentLoaded", async () => {
  updateThemeOptions();
  await loadQuestionsForCurrentSelection();
  updateProgressBar();

  // Afficher le popup bien centré au milieu
  openPopup();
});