<?php 
require_once "utils.php";
require_once "src/dao/DaoTimeslot.php";

class cntrlApp {
    public function getAccueil(){
        require_once PATH_VIEW . "vaccueil.php";
    }

    public function getHistorique(){
        if(!isset($utils)){
            $utils = new Utils();
        }
        $DaoTimeslot = new DaoTimeslot(
            getenv('DBHOST') ?: 'localhost',
            getenv('DBNAME') ?: 'bdehours',
            getenv('DBPORT') ?: 5432,
            getenv('DBUSER') ?: 'postgres',
            getenv('DBPASS') ?: 'Isen44N'
        );
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        if(!isset($_SESSION["user"])){
            $this->getAccueil();
            return;
        }
        $idUser = $_SESSION["user"]->getId();
        $timeslots = $DaoTimeslot->getFullTimeslotsByIdUser($idUser);
        $sumHours = $DaoTimeslot->getTotalHours($idUser)["somme"];
        require_once PATH_VIEW . "vtimeslots.php";
    }

    public function getEspacePerso(){
        if(!isset($utils)){
            $utils = new Utils();
        }
    
        $DaoTimeslot = new DaoTimeslot(
            getenv('DBHOST') ?: 'localhost',
            getenv('DBNAME') ?: 'bdehours',
            getenv('DBPORT') ?: 5432,
            getenv('DBUSER') ?: 'postgres',
            getenv('DBPASS') ?: 'Isen44N'
        );
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        if(!isset($_SESSION["user"])){
            $this->getAccueil();
            return;
        }
        $idUser = $_SESSION["user"]->getId();
        $timeslots = $DaoTimeslot->getTimeslotsByIdUser($idUser);
        require_once PATH_VIEW . "vuser.php";
    }

    public function getInsertResult(){
        if(!isset($utils)){
            $utils = new Utils();
        }
        $DaoTimeslot = new DaoTimeslot(
            getenv('DBHOST') ?: 'localhost',
            getenv('DBNAME') ?: 'bdehours',
            getenv('DBPORT') ?: 5432,
            getenv('DBUSER') ?: 'postgres',
            getenv('DBPASS') ?: 'Isen44N'
        );
        $date = $_POST["date"];
        $duration = $_POST["duration"];
        $description = $_POST["description"];
        $newDuration = $utils->convertHoursToDecimal($duration);
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        $idUser = $_SESSION["user"]->getId();

        $DaoTimeslot->insertTimeslot($date, $newDuration, $idUser, $description);

        $this->getEspacePerso();
    }

    public function getAdminPage(){
        if(!isset($utils)){
            $utils = new Utils();
        }
        $DaoTimeslot = new DaoTimeslot(
            getenv('DBHOST') ?: 'localhost',
            getenv('DBNAME') ?: 'bdehours',
            getenv('DBPORT') ?: 5432,
            getenv('DBUSER') ?: 'postgres',
            getenv('DBPASS') ?: 'Isen44N'
        );
        $DaoUser = new DaoUser(
            getenv('DBHOST') ?: 'localhost',
            getenv('DBNAME') ?: 'bdehours',
            getenv('DBPORT') ?: 5432,
            getenv('DBUSER') ?: 'postgres',
            getenv('DBPASS') ?: 'Isen44N'
        );
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        if(!isset($_SESSION["user"]) || $_SESSION["user"]->getIsAdmin() == 0){
            $this->getAccueil();
            return;
        }
        $idUser = $_SESSION["user"]->getId();
        $timeslotsToValidate = $DaoTimeslot->getUnvalidatedTimeslots();
        $allUsers = $DaoUser->getAllUsers();

        require_once PATH_VIEW . "vadmin.php";
    }

    public function getSpecificHistoric(){
        if(!isset($utils)){
            $utils = new Utils();
        }
        $DaoTimeslot = new DaoTimeslot(
            getenv('DBHOST') ?: 'localhost',
            getenv('DBNAME') ?: 'bdehours',
            getenv('DBPORT') ?: 5432,
            getenv('DBUSER') ?: 'postgres',
            getenv('DBPASS') ?: 'Isen44N'
        );
        $DaoUser = new DaoUser(
            getenv('DBHOST') ?: 'localhost',
            getenv('DBNAME') ?: 'bdehours',
            getenv('DBPORT') ?: 5432,
            getenv('DBUSER') ?: 'postgres',
            getenv('DBPASS') ?: 'Isen44N'
        );
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        if(!isset($_SESSION["user"])){
            $this->getAccueil();
            return;
        }
        if(!isset($_POST["idUserToInspect"])){
            $utils->echoInfo("Veuillez renseigner un utilisateur");
            $this->getAdminPage();
            return;
        }
    
        $idUser = $_POST["idUserToInspect"];
        if($idUser == 0){
            $utils->echoInfo("Veuillez renseigner un utilisateur");
            $this->getAdminPage();
            return;
        }
        $speUser = $DaoUser->getUserById($idUser);
        $sumHours = $DaoTimeslot->getTotalHours($idUser)["somme"];
        $timeslots = $DaoTimeslot->getFullTimeslotsByIdUser($idUser);
        require_once PATH_VIEW . "vspecifictimeslot.php";

    }

    public function getDeleteResult(){
        if(!isset($utils)){
            $utils = new Utils();
        }
        $DaoTimeslot = new DaoTimeslot(
            getenv('DBHOST') ?: 'localhost',
            getenv('DBNAME') ?: 'bdehours',
            getenv('DBPORT') ?: 5432,
            getenv('DBUSER') ?: 'postgres',
            getenv('DBPASS') ?: 'Isen44N'
        );
        $idDelete = $_POST["idDelete"];
        $DaoTimeslot->deleteTimeslotById($idDelete);

        $this->getEspacePerso();
    }

    public function getValidateResult(){
        if(!isset($utils)){
            $utils = new Utils();
        }
        $idValidate = $_POST["idValidate"];
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        $idUser = $_SESSION["user"]->getId();
        $DaoTimeslot = new DaoTimeslot(
            getenv('DBHOST') ?: 'localhost',
            getenv('DBNAME') ?: 'bdehours',
            getenv('DBPORT') ?: 5432,
            getenv('DBUSER') ?: 'postgres',
            getenv('DBPASS') ?: 'Isen44N'
        );
        $DaoTimeslot->validateTimeslot($idValidate, $idUser);
        $utils->echoSuccess("Horaire validé");
        $this->getAdminPage();
    }

    public function getRefuseResult(){
        if(!isset($utils)){
            $utils = new Utils();
        }
        $idRefuse = $_POST["idRefuse"];
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        $idUser = $_SESSION["user"]->getId();
        $DaoTimeslot = new DaoTimeslot(
            getenv('DBHOST') ?: 'localhost',
            getenv('DBNAME') ?: 'bdehours',
            getenv('DBPORT') ?: 5432,
            getenv('DBUSER') ?: 'postgres',
            getenv('DBPASS') ?: 'Isen44N'
        );
        $DaoTimeslot->refuseTimeslot($idRefuse, $idUser);
        $utils->echoSuccess("Horaire refusé");
        $this->getAdminPage();
    }



};