<?php
// Formulaire de création d'utilisateur (réservé aux administrateurs)
?>
<h2>Créer un nouvel utilisateur</h2>
<form method="post" action="?action=adduser">
    <label>Nom : <input type="text" name="name" required></label><br>
    <label>Prénom : <input type="text" name="surname" required></label><br>
    <label>Cycle : <input type="text" name="cycle" required></label><br>
    <label>Email : <input type="email" name="mail" required></label><br>
    <label>Mot de passe : <input type="password" name="password" required></label><br>
    <label>Spécialité : <select name="id_Speciality" required>
        <?php
        // Affichage dynamique des spécialités
        require_once 'src/dao/DaoSpeciality.php';
        $daoSpec = new DaoSpeciality(getenv('DBHOST') ?: 'localhost', getenv('DBNAME') ?: 'bdehours', getenv('DBPORT') ?: 5432, getenv('DBUSER') ?: 'postgres', getenv('DBPASS') ?: 'Isen44N');
        $specialities = $daoSpec->getAllSpecialities();
        foreach ($specialities as $spec) {
            echo '<option value="' . $spec->getId() . '">' . htmlspecialchars($spec->getType()) . '</option>';
        }
        ?>
    </select></label><br>
    <label>Administrateur : <input type="checkbox" name="is_admin" value="1"></label><br>
    <button type="submit">Créer l'utilisateur</button>
</form>

