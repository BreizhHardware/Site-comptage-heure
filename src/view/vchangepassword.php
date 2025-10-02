<?php require_once "header.php"; ?>
<link rel="stylesheet" href="/ressources/css/vuser.css">
<body>
    <div style="margin: 2%; text-align: center;">
        <h3>Changer le mot de passe</h3>
        <hr>
        <?php if(isset($error)) { echo '<div style="color:red">'.$error.'</div>'; } ?>
        <?php if(isset($success)) { echo '<div style="color:green">'.$success.'</div>'; } ?>
        <form method="POST" action="/changepassword">
            <div class="input-group mb-3">
                <input class="form-control" type="password" name="old_password" placeholder="Ancien mot de passe" required />
                <input class="form-control" type="password" name="new_password" placeholder="Nouveau mot de passe" required />
                <input class="form-control" type="password" name="confirm_password" placeholder="Confirmer le nouveau mot de passe" required />
                <button type="submit" class="btn btn-outline-primary">Changer</button>
            </div>
        </form>
    </div>
</body>

