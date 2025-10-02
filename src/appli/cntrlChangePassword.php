<?php
session_start();
require_once __DIR__ . '/../dao/DaoUser.php';
require_once __DIR__ . '/../metier/User.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (!isset($_SESSION['user'])) {
    header('Location: /login');
    exit();
}

$error = null;
$success = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $old = $_POST['old_password'] ?? '';
    $new = $_POST['new_password'] ?? '';
    $confirm = $_POST['confirm_password'] ?? '';
    $user = $_SESSION['user'];
    // Utilisation des mêmes paramètres que dans index.php
    $dao = new DaoUser(
        getenv('DBHOST') ?: 'localhost',
        getenv('DBNAME') ?: 'bdehours',
        getenv('DBPORT') ?: 5432,
        getenv('DBUSER') ?: 'postgres',
        getenv('DBPASS') ?: 'Isen44N'
    );
    $userObj = $dao->getUserById($user->getId());

    if (!$userObj || !password_verify($old, $userObj['password'])) {
        $error = 'Ancien mot de passe incorrect.';
    } elseif ($new !== $confirm) {
        $error = 'Les mots de passe ne correspondent pas.';
    } elseif (strlen($new) < 6) {
        $error = 'Le mot de passe doit contenir au moins 6 caractères.';
    } else {
        $hash = password_hash($new, PASSWORD_DEFAULT);
        $dao->updatePassword($userObj['id'], $hash);
        $success = 'Mot de passe changé avec succès.';
    }
}

require_once __DIR__ . '/../view/vchangepassword.php';
