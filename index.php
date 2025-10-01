<?php
// Organize server path requested
setlocale(LC_TIME, 'fr_FR.utf8','fra');
$method = $_SERVER["REQUEST_METHOD"];                   // Récupération de la méthode (GET/POST)
$uri    = explode("?", $_SERVER["REQUEST_URI"])[0];     // Récupération du contexte (/...)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "src/appli/cntrlLogin.php";
require_once "src/appli/cntrlApp.php";
require_once "src/appli/utils.php";

$DaoTimeslot = new DaoTimeslot(
    getenv('DBHOST') ?: 'localhost',
    getenv('DBNAME') ?: 'bdehours',
    getenv('DBPORT') ?: 5432,
    getenv('DBUSER') ?: 'postgres',
    getenv('DBPASS') ?: 'Isen44N'
);
$cntrlLogin = new cntrlLogin();
$cntrlApp   = new cntrlApp();
$utils = new Utils();

if($method == "GET"){
    if($uri == "/login")    $cntrlLogin->getLoginForm();
    if($uri == "/login/result")    $cntrlLogin->getLoginResult();
    if($uri == "/accueil")  $cntrlApp->getAccueil();
    if($uri == "/espaceperso")  $cntrlApp->getEspacePerso();
    if($uri == "/disconnect")  $utils->destructSession();
    if($uri == "/historique")  $cntrlApp->getHistorique();
    if($uri == "/admin")  $cntrlApp->getAdminPage();
    if($uri == "/debug") $DaoTimeslot->getTimeslotsByIdUser(1);
    

}
elseif($method == "POST"){
    if($uri == "/espaceperso/register/result") $cntrlApp->getInsertResult();
    if($uri == "/login/result")    $cntrlLogin->getLoginResult();
    if($uri == "/espaceperso/delete") $cntrlApp->getDeleteResult();
    if($uri == "/admin/validate") $cntrlApp->getValidateResult();
    if($uri == "/admin/refuse") $cntrlApp->getRefuseResult();
    if($uri == "/admin/historique") $cntrlApp->getSpecificHistoric();
}
