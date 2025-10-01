<?php 
require_once "src/metier/Speciality.php";
require_once "src/dao/DaoSpeciality.php";
require_once "src/appli/utils.php";
class User {

    private int $id;
    private string $name;
    private string $surname;
    private string $cycle;
    private string $mail;
    private Speciality $speciality;
    private bool $isAdmin;

    public function __construct(int $id, string $name, string $surname, string $cycle, string $mail, bool $isAdmin = NULL){
        $DaoSpeciality = new DaoSpeciality(
            getenv('DBHOST') ?: 'localhost',
            getenv('DBNAME') ?: 'bdehours',
            getenv('DBPORT') ?: 5432,
            getenv('DBUSER') ?: 'postgres',
            getenv('DBPASS') ?: 'Isen44N'
        );
        $this->id = $id;
        $this->name = $name;
        $this->surname = $surname;
        $this->cycle = $cycle;
        $this->mail = $mail;
        $this->isAdmin = $isAdmin;
        $this->speciality = $DaoSpeciality->getSpecialityOfUser($id);

    }
    public function getId() : int{
        return $this->id;
    }
    public function getName() : string{
        return $this->name;
    }
    public function getSurname() : string{
        return $this->surname;
    }
    public function getCycle() : string{
        return $this->cycle;
    }
    public function getMail() : string{
        return $this->mail;
    }
    public function getSpeciality() : Speciality{
        return $this->speciality;
    }
    public function getIsAdmin() : bool{
        return $this->isAdmin;
    }

};