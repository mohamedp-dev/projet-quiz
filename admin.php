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
    <title>Admin - Gestion des Questions</title>
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <div class="container">
        <h1>Gestion des Questions</h1>
        
        <!-- Section Ajout de Question -->
        <div class="card">
            <h2>Ajouter une nouvelle question</h2>
            <div class="form-group">
                <label>Type de question :</label>
                <select id="question-type">
                    <option value="qcm">QCM</option>
                    <option value="truefalse">Vrai/Faux</option>
                    <option value="open">RÃ©ponse ouverte</option>
                </select>
            </div>

            <div class="form-group">
                <label>Question :</label>
                <input type="text" id="question-text" placeholder="Entrez votre question">
            </div>

            <!-- Options dynamiques selon le type -->
            <div id="options-container"></div>

            <button id="add-question-btn" class="btn-primary">Ajouter la question</button>
        </div>

        <!-- Liste des questions existantes -->
        <div class="card">
            <h2>Questions existantes</h2>
            <div id="questions-list"></div>
        </div>
    </div>

    <script src="admin.js"></script>
</body>
</html>