let questionData = [];
let currentQuestion = 0;
let nickname = "";
let score = 0;
let totalQuestions = 10;
let shuffledQuestions = [];

// Charger les questions dynamiquement depuis questions.json
fetch("questions.json")
  .then(response => response.json())
  .then(data => {
    questionData = data;
    console.log("Questions chargées:", questionData);
    // Set max attribute for numQuestionsInput after questions are loaded
    document.getElementById("numQuestionsInput").setAttribute("max", questionData.length);
  })
  .catch(error => {
    console.error("Erreur de chargement des questions :", error);
    alert("Impossible de charger les questions du quiz.");
  });

// Sélection des éléments du DOM
const themeSelect = document.getElementById("themeSelect");
const nicknameInput = document.getElementById("nicknameInput");
const numQuestionsInput = document.getElementById("numQuestionsInput");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");
const termsPopup = document.getElementById("terms-popup");
const acceptTermsBtn = document.getElementById("acceptTermsBtn");
const declineTermsBtn = document.getElementById("declineTermsBtn");

// Afficher le popup des conditions d'acceptation
window.onload = () => {
  termsPopup.style.display = "block";
  updateProgressBar(); // Initialize progress bar
};

// Sélection des éléments du quiz
const subjectEl = document.getElementById("subject");
const questionTextEl = document.getElementById("questionText");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const quizContent = document.getElementById("quiz-content");
const initialSetup = document.getElementById("initial-setup");
const finalNickname = document.getElementById("finalNickname");
const quizEnd = document.getElementById("quiz-end");

// ⚡ Remplace <NICKNAME> dans les questions et feedback
function injectNickname(text) {
  return text.replaceAll("<NICKNAME>", nickname);
}

// 🎲 Mélange les questions et limite à X questions
function shuffleQuestions() {
  shuffledQuestions = questionData
    .sort(() => 0.5 - Math.random())
    .slice(0, totalQuestions);
}

// 🎯 Affiche la question actuelle
function loadQuestion() {
  const q = shuffledQuestions[currentQuestion];
  subjectEl.innerText = injectNickname(q.subject);
  questionTextEl.innerText = injectNickname(q.question);
  feedbackEl.innerText = "";
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

// 🧠 Gère la réponse
function handleAnswer(choice) {
  const q = shuffledQuestions[currentQuestion];
  let feedback = "";

  // Disable all choice buttons after an answer is selected
  Array.from(choicesEl.children).forEach(button => {
    button.disabled = true;
  });

  if (q.feedback && q.feedback[choice]) {
    feedback = injectNickname(q.feedback[choice]);
  } else if (q.answer) {
    feedback = injectNickname(q.answer);
  } else {
    feedback = "Réponse enregistrée... ou pas 🤷‍♂️";
  }

  feedbackEl.innerText = feedback;
}

// ▶️ Question suivante
nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < shuffledQuestions.length) {
    loadQuestion();
  } else {
    showEndScreen();
  }
});

// 🏁 Fin du quiz
function showEndScreen() {
  quizContent.style.display = "none";
  quizEnd.style.display = "block";
  finalNickname.innerText = nickname;
  updateProgressBar(); // Update progress bar to 100% at the end
}

// 🔁 Restart quiz
document.getElementById("restartQuizBtn").addEventListener("click", () => {
  currentQuestion = 0;
  score = 0; // Reset score on restart
  quizEnd.style.display = "none";
  initialSetup.style.display = "block";
  document.getElementById("nicknameInput").value = "";
  updateProgressBar(); // Reset progress bar on restart
});

// ▶️ Start Quiz
document.getElementById("startQuizBtn").addEventListener("click", () => {
  nickname = document.getElementById("nicknameInput").value.trim() || "Anonyme";
  totalQuestions = parseInt(document.getElementById("numQuestionsInput").value) || 10;

  // Ensure totalQuestions does not exceed available questions
  if (totalQuestions > questionData.length) {
    totalQuestions = questionData.length;
    numQuestionsInput.value = questionData.length; // Update input to reflect actual number
  }

  shuffleQuestions();
  currentQuestion = 0;
  score = 0; // Ensure score is reset on start

  initialSetup.style.display = "none";
  quizContent.style.display = "block";
  loadQuestion();
});

// 🚪 Gestion des conditions d'acceptation
document.getElementById("acceptTermsBtn").addEventListener("click", () => {
  document.getElementById("terms-popup").style.display = "none";
});
document.getElementById("declineTermsBtn").addEventListener("click", () => {
  alert("Vous devez accepter les termes pour continuer.");
  // Optionally, disable parts of the page or redirect if terms are not accepted
});

// ✨ Animation des questions
function animateQuestion() {
  questionTextEl.classList.remove("fade-in");
  void questionTextEl.offsetWidth; // trigger reflow to restart animation
  questionTextEl.classList.add("fade-in");
}

// 📊 Update Progress Bar
function updateProgressBar() {
  const percent = Math.floor((currentQuestion / totalQuestions) * 100);
  progressBar.style.width = percent + "%";
}

// 🎨 Theme Switching Logic
themeSelect.addEventListener("change", (event) => {
  document.body.className = `theme-${event.target.value}`;
});