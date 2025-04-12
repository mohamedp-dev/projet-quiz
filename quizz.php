<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "quiz";

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifiez la connexion
if ($conn->connect_error) {
    die("Échec de la connexion : " . $conn->connect_error);
}

// Requête pour sélectionner les données
$sql = "SELECT * FROM quizz";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "ID : " . $row["id"] . " - Nom : " . $row["nom"] . "<br>";
    }
} else {
    echo "Aucun résultat trouvé.";
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz - Quiz en ligne</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Quiz en Ligne</h1>
        <div id="user-info">
            Bienvenue <span id="user-name"></span>!
            <button onclick="logout()">Déconnexion</button>
        </div>
    </header>

    <div class="quiz-container">
        <div class="progress-bar">
            <div class="progress"></div>
        </div>

        <h2 id="question">Question en cours...</h2>

        <div id="answers-container">
            <!-- Les réponses seront ajoutées dynamiquement -->
        </div>

        <div id="timer">Temps restant : 10s</div>
        <button id="next-btn">Suivant</button>
    </div>
    
    <button id="restart-btn" style="display: none;">Recommencer</button>

    <!-- Profil Utilisateur -->
<div id="profile-section" style="display: none;">
    <h2>Profil de <span id="profile-username"></span></h2>
    
    <div class="profile-stats">
        <div class="stat-card">
            <h3>Meilleur Score</h3>
            <p id="best-score">0</p>
        </div>
        <div class="stat-card">
            <h3>Quiz Complétés</h3>
            <p id="quiz-completed">0</p>
        </div>
    </div>
    
    <h3>Historique des Quiz</h3>
    <table id="quiz-history">
        <thead>
            <tr>
                <th>Date</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
    
    <button onclick="hideProfile()">Retour au Quiz</button>
</div>

<div class="quiz-progress">
    <div class="progress-bar">
        <div class="progress-fill"></div>
    </div>
    <span class="progress-text">Question 1/10</span>
</div>

<!-- un bouton pour accéder au profil -->
<button id="view-profile-btn" onclick="showProfile()">Voir mon Profil</button>


    <script src="quizz.js"></script>
    <script src="auth.js"></script>
</body>
</html>

