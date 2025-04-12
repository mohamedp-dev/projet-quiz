// Fonctions pour basculer entre les formulaires
function showRegisterForm() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
}

function showLoginForm() {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
}

// Fonction d'inscription
function register() {
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validation
    if (!username || !password || !confirmPassword) {
        showError("Tous les champs sont obligatoires");
        return;
    }

    if (password !== confirmPassword) {
        showError("Les mots de passe ne correspondent pas");
        return;
    }

    if (password.length < 6) {
        showError("Le mot de passe doit contenir au moins 6 caractères");
        return;
    }

    // Vérifier si l'utilisateur existe déjà
    if (localStorage.getItem(username)) {
        showError("Ce nom d'utilisateur est déjà pris");
        return;
    }

    // Enregistrer le nouvel utilisateur
    const user = {
        password: hashPassword(password),
        bestScore: "0/0",
        quizHistory: []
    };
    
    localStorage.setItem(username, JSON.stringify(user));
    
    // Connecter automatiquement et rediriger
    localStorage.setItem("currentUser", username);
    window.location.href = "quizz.html";
}

// Fonction de connexion
function login() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;

    // Validation
    if (!username || !password) {
        showError("Nom d'utilisateur et mot de passe requis");
        return;
    }

    const userData = localStorage.getItem(username);
    if (!userData) {
        showError("Nom d'utilisateur incorrect");
        return;
    }

    const user = JSON.parse(userData);
    if (user.password !== hashPassword(password)) {
        showError("Mot de passe incorrect");
        return;
    }

    localStorage.setItem("currentUser", username);
    
    // Redirection vérifiée
    if (!window.location.href.endsWith("quizz.html")) {
        window.location.href = "quizz.html";
    }
}

// Fonction pour hasher le mot de passe (simplifié)
function hashPassword(password) {
    function hashPassword(password) {
        // Solution plus robuste avec itération
        let hash = password + "!quizSalt";
        for (let i = 0; i < 5; i++) {
            hash = btoa(unescape(encodeURIComponent(hash)));
        }
        return hash;
    }
}

// Afficher les messages d'erreur
function showError(message) {
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    errorElement.style.color = "#e74c3c";
    errorElement.style.marginTop = "10px";
    errorElement.style.textAlign = "center";

    // Supprimer les anciens messages d'erreur
    const oldError = document.querySelector(".error-message");
    if (oldError) oldError.remove();

    // Ajouter le nouveau message
    const currentForm = document.querySelector("#register-form[style='display: block;']") 
        || document.getElementById("login-form");
    currentForm.appendChild(errorElement);
}

// Gestion de la soumission avec Enter
document.addEventListener("DOMContentLoaded", () => {
    // Pour le formulaire de connexion
    document.getElementById("login-password").addEventListener("keypress", (e) => {
        if (e.key === "Enter") login();
    });

    // Pour le formulaire d'inscription
    document.getElementById("confirm-password").addEventListener("keypress", (e) => {
        if (e.key === "Enter") register();
    });
});