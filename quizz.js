// Variables globales
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft;
let questions = [];
let quizStarted = false;

// Initialisation du quiz
document.addEventListener("DOMContentLoaded", () => {
    // Vérifier la connexion
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        window.location.href = "auth.html";
        return;
    }

    // Afficher le nom d'utilisateur
    document.getElementById("user-name").textContent = currentUser;

    // Charger les questions
    loadSampleQuestions();
    
    // Écouteurs d'événements
    document.getElementById("next-btn").addEventListener("click", nextQuestion);
    document.getElementById("restart-btn").addEventListener("click", restartQuiz);

    // Démarrer le quiz
    startQuiz();
});

// Charger des questions exemple
function loadSampleQuestions() {
    questions = [
        {
            type: "qcm",
            question: "Quelle est la capitale de la France ?",
            answers: ["Berlin", "Madrid", "Paris", "Rome"],
            correct: 2,
            explanation: "Paris est la capitale depuis 508 ans",
            timeLimit: 15
        },
        {
            type: "truefalse",
            question: "JavaScript est un langage côté serveur.",
            correct: false,
            explanation: "JavaScript s'exécute côté client (navigateur)",
            timeLimit: 10
        },
        {
            type: "open",
            question: "Quel langage utilise React comme bibliothèque principale ?",
            acceptedAnswers: ["javascript", "js"],
            explanation: "React est une bibliothèque JavaScript",
            timeLimit: 20
        }
    ];
}

// Démarrer le quiz
function startQuiz() {
    quizStarted = true;
    score = 0;
    currentQuestionIndex = 0;
    document.querySelector('.quiz-progress').classList.remove('quiz-ended');
    showQuestion();
}

// Afficher la question actuelle
function showQuestion() {
    if (!quizStarted || currentQuestionIndex >= questions.length) return;

    const question = questions[currentQuestionIndex];
    const questionElement = document.getElementById("question");
    const answersContainer = document.getElementById("answers-container");
    
    // Mettre à jour l'interface
    questionElement.textContent = question.question;
    answersContainer.innerHTML = "";
    
    // Gestion des différents types de questions
    switch(question.type) {
        case "truefalse":
            renderTrueFalse(question, answersContainer);
            break;
        case "open":
            renderOpenQuestion(question, answersContainer);
            break;
        default: // QCM par défaut
            renderQCM(question, answersContainer);
    }
    
    updateProgress();
    startTimer(question.timeLimit || 15);
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("restart-btn").style.display = "none";
}

// Rendu QCM
function renderQCM(question, container) {
    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.className = "answer";
        button.textContent = answer;
        button.addEventListener("click", () => selectAnswer(index));
        container.appendChild(button);
    });
}

// Rendu Vrai/Faux
function renderTrueFalse(question, container) {
    const trueBtn = document.createElement("button");
    trueBtn.className = "answer";
    trueBtn.textContent = "Vrai";
    trueBtn.addEventListener("click", () => selectAnswer(true));
    
    const falseBtn = document.createElement("button");
    falseBtn.className = "answer";
    falseBtn.textContent = "Faux";
    falseBtn.addEventListener("click", () => selectAnswer(false));
    
    container.append(trueBtn, falseBtn);
}

// Rendu question ouverte
function renderOpenQuestion(question, container) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Votre réponse...";
    input.id = "open-answer";
    input.className = "open-input";
    
    const submitBtn = document.createElement("button");
    submitBtn.className = "submit-answer";
    submitBtn.textContent = "Valider";
    submitBtn.addEventListener("click", checkOpenAnswer);
    
    container.append(input, submitBtn);
}

// Gérer la sélection de réponse
function selectAnswer(userAnswer) {
    if (!quizStarted) return;

    clearInterval(timerInterval);
    const question = questions[currentQuestionIndex];
    let isCorrect = false;
    
    switch(question.type) {
        case "truefalse":
            isCorrect = userAnswer === question.correct;
            break;
        case "open":
            return; // Géré séparément dans checkOpenAnswer()
        default: 
            isCorrect = userAnswer === question.correct;
    }

    showFeedback(isCorrect, question);
    if (isCorrect) score++;
    document.getElementById("next-btn").style.display = "block";
}

// Vérifier réponse ouverte
function checkOpenAnswer() {
    const question = questions[currentQuestionIndex];
    const userAnswer = document.getElementById("open-answer").value.trim().toLowerCase();
    const isCorrect = question.acceptedAnswers.includes(userAnswer);
    
    clearInterval(timerInterval);
    showFeedback(isCorrect, question);
    if (isCorrect) score++;
    document.getElementById("next-btn").style.display = "block";
}

// Afficher le feedback
function showFeedback(isCorrect, question) {
    const answersContainer = document.getElementById("answers-container");
    const feedback = document.createElement("div");
    feedback.className = isCorrect ? "correct-feedback" : "incorrect-feedback";
    
    // Désactiver tous les éléments interactifs
    const interactiveElements = answersContainer.querySelectorAll("button, input");
    interactiveElements.forEach(el => el.disabled = true);
    
    // Afficher l'explication si disponible
    if (question.explanation) {
        const expl = document.createElement("div");
        expl.className = "explanation";
        expl.textContent = question.explanation;
        feedback.appendChild(expl);
    }
    
    answersContainer.appendChild(feedback);
}

// Passer à la question suivante
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

// Terminer le quiz
function endQuiz() {
    quizStarted = false;
    const questionElement = document.getElementById("question");
    const answersContainer = document.getElementById("answers-container");
    
    questionElement.textContent = `Quiz terminé ! Votre score : ${score}/${questions.length}`;
    answersContainer.innerHTML = "";
    
    updateProgress(true);
    document.querySelector('.quiz-progress').classList.add('quiz-ended');
    document.getElementById("restart-btn").style.display = "block";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("timer").textContent = "";
    
    saveScore();
}

// Redémarrer le quiz
function restartQuiz() {
    startQuiz();
}

// Gestion du timer
function startTimer(seconds) {
    timeLeft = seconds;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = `Temps restant : ${timeLeft}s`;
    timerElement.classList.remove("timer-warning");
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Temps restant : ${timeLeft}s`;
        
        if (timeLeft <= 5) {
            timerElement.classList.add("timer-warning");
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = "Temps écoulé !";
            if (questions[currentQuestionIndex].type === "open") {
                checkOpenAnswer();
            } else {
                selectAnswer(-1);
            }
        }
    }, 1000);
}

// Mettre à jour la progression
function updateProgress(isQuizEnd = false) {
    const progressBar = document.querySelector(".progress-fill");
    const progressText = document.querySelector(".progress-text");
    
    if (isQuizEnd) {
        progressBar.style.width = "100%";
        progressText.textContent = `Terminé ! ${questions.length}/${questions.length}`;
    } else {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    }
}

// Sauvegarder le score
function saveScore() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;
    
    const user = JSON.parse(localStorage.getItem(currentUser)) || {};
    user.quizHistory = user.quizHistory || [];
    
    user.quizHistory.push({
        date: new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        score: score,
        total: questions.length
    });
    
    const currentBest = user.bestScore ? parseInt(user.bestScore.split('/')[0]) : 0;
    if (score > currentBest) {
        user.bestScore = `${score}/${questions.length}`;
    }
    
    localStorage.setItem(currentUser, JSON.stringify(user));
}

// Gestion du profil utilisateur
function showProfile() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;
    
    const user = JSON.parse(localStorage.getItem(currentUser)) || {};
    document.getElementById("profile-username").textContent = currentUser;
    document.getElementById("best-score").textContent = user.bestScore || "0/0";
    document.getElementById("quiz-completed").textContent = user.quizHistory?.length || 0;
    
    const tbody = document.getElementById("quiz-history").querySelector("tbody");
    tbody.innerHTML = "";
    
    user.quizHistory?.forEach(quiz => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${quiz.date}</td>
            <td>${quiz.score}/${quiz.total}</td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById("profile-section").style.display = "block";
    document.querySelector(".quiz-container").style.display = "none";
}

function hideProfile() {
    document.getElementById("profile-section").style.display = "none";
    document.querySelector(".quiz-container").style.display = "block";
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "auth.html";
}