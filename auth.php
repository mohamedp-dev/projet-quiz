<?php
$new_user_html = '';
$mysqlClient = new PDO(
    'mysql:host=localhost;port=3306;dbname=quiz;charset=utf8',
    'root',
    '',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION],

);
// Requête pour récupérer tous les utilisateurs :
$users_sql = $mysqlClient->prepare('SELECT * FROM utilisateurs');
$users_sql->execute();
$users = $users_sql->fetchALL(); //Récupération de tout le contenu de la table 'Users' dans la variable '$users'

$user_html = ''; //$user_html servira à ajouter le code html de la liste des utilisateurs dans l'endroit voulu de la page html
foreach ($users as $user) {

    $user_html .= '<ul> <li> Email : ' . htmlspecialchars($user['Email']);
    $user_html .= '<li> Prénom/Nom : ' . htmlspecialchars($user['Surname']) . '/' . htmlspecialchars($user['Name']) . '</ul>';
};

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $surname = $_POST["surname"];
    $name = $_POST["name"];
    $email = $_POST["email"];
    $password = $_POST["password"];




    $users_sql = $mysqlClient->prepare('INSERT INTO Users(Surname,Name,Email,MotDePasse) VALUES (:surname, :name, :email, :password)');
    $users_sql->execute([
        'surname' => $surname,
        'name' => $name,
        'email' => $email,
        'password' => $password,
    ]);

    $mysqlClient = new PDO(
        'mysql:host=localhost;dbname=Cours_Techno_Web_Exemple_MySQL;charset=utf8',
        'root',
        'root',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION],

    );
    $new_user_html .= "<h2> Vous venez d'ajouter l'utilisateur suivant :</h2>";
    $new_user_sql = $mysqlClient->prepare('SELECT * FROM Users WHERE Email=:email');
    $new_user_sql->execute([
        'email' => $email
    ]);
    $new_user = $new_user_sql->fetchALL();

    $new_user_html .= '<ul><li> Email : ' . htmlspecialchars($new_user[0]['Email']);
    $new_user_html .= '<li> Prénom/Nom : ' . htmlspecialchars($new_user[0]['Surname']) . '/' . htmlspecialchars($new_user[0]['Name']) . '</ul>';
};

?>


<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - Quiz en ligne</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="auth-container">
        <h1>Quiz en Ligne</h1>
        
        <div id="login-form">
            <h2>Connexion</h2>
            <input type="text" id="login-username" placeholder="Nom d'utilisateur" required>
            <input type="password" id="login-password" placeholder="Mot de passe" required>
            <button onclick="login()">Se connecter</button>
            <p>Pas encore inscrit ? <a href="#" onclick="showRegisterForm()">S'inscrire</a></p>
        </div>
    
        <div id="register-form" style="displa.
        33y: none;">
            <h2>Inscription</h2>
            <input type="text" id="register-username" placeholder="Nom d'utilisateur" required>
            <input type="password" id="register-password" placeholder="Mot de passe" required>
            <input type="password" id="confirm-password" placeholder="Confirmer le mot de passe" required>
            <button onclick="register()">S'inscrire</button>
            <p>Déjà un compte ? <a href="#" onclick="showLoginForm()">Se connecter</a></p>
        </div>
        <?php
        echo $new_user_html
        ?>
    </div>

    <script src="auth.js"></script>
</body>
</html>