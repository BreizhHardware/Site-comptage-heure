<?php 
require_once "src/metier/Speciality.php";
class DaoSpeciality {
    private string $host;
    private string $dbname;
    private string $user;
    private string $pass;
    private PDO $db;

    public function __construct(string $host, string $dbname, int $port, string $user, string $pass) {
        $this->host = $host;
        $this->dbname = $dbname;
        $this->user = $user;
        $this->pass = $pass;

        try {
            $this->db = new PDO("pgsql:dbname=" . $dbname . ";host=" . $host . ";port=" . $port, $user, $pass);
        } catch (PDOException $e) {
            $erreurs = [];
	        echo $e->getMessage();
        }
    }

    public function getSpecialityOfUser(int $idUser){
        $statement = $this->db->prepare("SELECT s.id, s.type FROM speciality s JOIN users u ON s.id = u.id_speciality WHERE u.id = :idUser");
        $statement->bindParam(":idUser", $idUser);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        $speciality = new Speciality($result["id"], $result["type"]);
        return $speciality;
    }

    public function getAllSpecialities() {
        $statement = $this->db->prepare("SELECT id, type FROM speciality ORDER BY id ASC");
        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);
        $specialities = [];
        foreach ($results as $row) {
            $specialities[] = new Speciality($row['id'], $row['type']);
        }
        return $specialities;
    }

};