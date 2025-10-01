<?php
require_once "src/dao/DaoUser.php";
require_once "src/appli/utils.php";
require_once "src/dao/DaoSpeciality.php";

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['user']) || !$_SESSION['user']->getIsAdmin()) {
    header('Location: index.php');
    exit();
}

$utils = new Utils();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $surname = $_POST['surname'] ?? '';
    $cycle = $_POST['cycle'] ?? '';
    $mail = $_POST['mail'] ?? '';
    $password = $_POST['password'] ?? '';
    $id_Speciality = $_POST['id_Speciality'] ?? '';
    $is_admin = isset($_POST['is_admin']) ? true : false;

    if ($name && $surname && $cycle && $mail && $password && $id_Speciality) {
        $DaoUser = new DaoUser(getenv('DBHOST') ?: 'localhost', getenv('DBNAME') ?: 'bdehours', getenv('DBPORT') ?: 5432, getenv('DBUSER') ?: 'postgres', getenv('DBPASS') ?: 'Isen44N');
        $success = $DaoUser->addUser($name, $surname, $cycle, $mail, $password, $id_Speciality, $is_admin);
        if ($success) {
            header('Location: /admin');
            exit();
        } else {
            $utils->echoError("Erreur lors de la création de l'utilisateur.");
        }
    } else {
        $utils->echoError("Tous les champs sont obligatoires.");
    }
}
require_once "src/view/vadduser.php";
