<?php
require_once "src/metier/User.php";
class DaoUser {
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
    public function connectUser(string $mail, string $password) {
        $id = NULL;

        $statement = $this->db->prepare("SELECT id, password FROM users WHERE mail = :mail");
        $statement->bindParam(":mail", $mail);
        $statement->execute();
        $user = $statement->fetch(PDO::FETCH_ASSOC);

        if ($user != false) {
            if (password_verify($password, $user['password'])) $id = $user['id'];
        }
        return $id;
    }
    public function getUserById($id){
        $statement = $this->db->prepare("SELECT id, name, surname, cycle, mail, id_speciality, is_admin FROM users WHERE id = :id");
        $statement->bindParam(":id", $id);
        $statement->execute();
        $user = $statement->fetch(PDO::FETCH_ASSOC);
        return $user;
    }
    public function getAllUsers(){
        $statement = $this->db->prepare("SELECT u.id, u.name, u.surname, u.cycle, u.mail, u.is_admin FROM users u ORDER BY name ASC");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        foreach($result as $user){
            $users[] = new User($user['id'], $user['name'], $user['surname'], $user['cycle'], $user['mail'], $user['is_admin']);
        }
        return $users;
    }
    public function addUser($name, $surname, $cycle, $mail, $password, $id_speciality, $is_admin) {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $statement = $this->db->prepare("INSERT INTO users (name, surname, cycle, mail, password, id_speciality, is_admin) VALUES (:name, :surname, :cycle, :mail, :password, :id_speciality, :is_admin)");
        $statement->bindParam(":name", $name);
        $statement->bindParam(":surname", $surname);
        $statement->bindParam(":cycle", $cycle);
        $statement->bindParam(":mail", $mail);
        $statement->bindParam(":password", $hashedPassword);
        $statement->bindParam(":id_speciality", $id_speciality);
        $statement->bindParam(":is_admin", $is_admin, PDO::PARAM_BOOL);
        return $statement->execute();
    }
};