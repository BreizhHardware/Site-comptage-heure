<?php

const PATH_VIEW = "src/view/";
const PATH_CSS = "ressources/css/";
$DBHOST = getenv('DBHOST') ?: 'localhost';
$DBNAME = getenv('DBNAME') ?: 'bdehours';
$PORT   = getenv('DBPORT') ?: 5432;
$USER   = getenv('DBUSER') ?: 'postgres';
$PASS   = getenv('DBPASS') ?: 'Isen44N';

require_once "src/dao/DaoUser.php";
require_once "src/metier/User.php";
require_once "src/dao/DaoSpeciality.php";

class Utils {

    public function hash_password(string $password) {
        password_hash($password, PASSWORD_BCRYPT);
    }

    public function echoSuccess($needle){
        echo '
            <div class="errorWrapper">
                  <div class="alert alert-success alert-dismissible d-flex align-items-center fade show">
                        <i class="bi-check-circle-fill"></i>
                        <strong class="mx-2">Succès!</strong>'. $needle. '
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            </div>
        ';
    }
    public function echoError($needle){
        echo '
                <div class="errorWrapper">
                    <div class="alert alert-danger alert-dismissible d-flex align-items-center fade show">
                        <i class="bi-exclamation-octagon-fill"></i>
                        <strong class="mx-2">Erreur!</strong>'. $needle . '
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                </div>
        ';
    }
    public function echoWarning($needle){
        echo '
             <div class="errorWrapper">
                <div class="alert alert-warning alert-dismissible d-flex align-items-center fade show">
                    <i class="bi-exclamation-triangle-fill"></i>
                    <strong class="mx-2">Attention!</strong>' . $needle . '
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
             </div>
        ';
    }

    public function echoInfo($needle){
        echo '
             <div class="errorWrapper">
                <div class="alert alert-info alert-dismissible d-flex align-items-center fade show">
                    <i class="bi-info-circle-fill"></i>
                    <strong class="mx-2">Info!</strong>' . $needle . '
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            </div>
        ';
    }

    public function constructSession($id){
        global $DBHOST, $DBNAME, $PORT, $USER, $PASS;
        $DaoUser = new DaoUser($DBHOST, $DBNAME, $PORT, $USER, $PASS);
        $DaoSpeciality = new DaoSpeciality($DBHOST, $DBNAME, $PORT, $USER, $PASS);
        $result = $DaoUser->getUserById($id);
        $user = new User($result['id'], $result['name'], $result['surname'], $result['cycle'], $result['mail'], $result['is_admin']);
        if(session_status() === PHP_SESSION_NONE){
            session_start();
        }
        $_SESSION["user"] = $user;
    }
    public function destructSession(){
        if(session_status() === PHP_SESSION_NONE){
            session_start();
        }
        session_destroy();
        require PATH_VIEW . "vaccueil.php";
    }
    public function convertHoursToDecimal($time){
        $sep = explode(":", $time);
        if (count($sep) !== 2 || !is_numeric($sep[1])) {
            throw new InvalidArgumentException("Invalid time format. Expected HH:MM.");
        }
        $hours = $sep[0];
        $minutes = round($sep[1] / 60, 2);
        return (float) ($hours + $minutes);
    }
    function convertDecimalToHours($dec)
    {
        // start by converting to seconds
        $seconds = ($dec * 3600);
        // we're given hours, so let's get those the easy way
        $hours = floor($dec);
        // since we've "calculated" hours, let's remove them from the seconds variable
        $seconds -= $hours * 3600;
        // calculate minutes left
        $minutes = ceil($seconds / 60);
        if ($minutes == 0){
            $minutes = "00";
        }
        // remove those from seconds as well
        $seconds -= $minutes * 60;
        // return the time formatted HH\hMM
        return (string) ($hours)."h".($minutes);
    }
};