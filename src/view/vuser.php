<?php require_once "header.php"
; ?>
<link rel="stylesheet" href="/ressources/css/vuser.css">
<body>
    <div class="" style="margin: 2%; text-align: center;">
        <h3 class="" style="text-align: left;">Insérer un temps de travail</h5>
        <hr>

        <form method="POST" action="/espaceperso/register/result">
        <p>Date du travail / Durée / Descriptif</p>
        <div class="input-group mb-3">
            <div class="col-lg-3 col-sm-6 controllerInput">
                <label for="startDate"></label>
                <input id="startDate" class="form-control" type="date" name="date" placeholder="Date du travai" required/>
                <span id="startDateSelected"></span>
            </div>
            <input type="time" id="timeEnd"  name="duration" class="form-control form-control-sm" required/>
            <input class="form-control" type="textarea" placeholder="Descriptif du travail réalisé" name="description" required></input>
            <button type="submit" class="btn btn-outline-primary" data-mdb-ripple-init data-mdb-ripple-color="dark">Enregistrer</button>

        </div>
        </form>
        <?php 
        
        ?>

        <h3 class="" style="text-align: left; margin-top: 2%;">Ajouts récents</h3>
        <hr>
        <?php if(!empty($timeslots)){ ?>
        <table class="table">
            <thead class="thead-dark">
                <tr>
                <th scope="col">id</th>
                <th scope="col">Date</th>
                <th scope="col">Durée</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
                <th scope="col">Supprimer</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($timeslots as $timeslot){ 
    
                    ?>
                    <tr>
                        <td scope="row"><?php echo $timeslot->getId(); ?></td>
                        <td><?php echo $timeslot->getDate()->format("l j M"); ?></td>
                        <td><?php echo $utils->convertDecimalToHours($timeslot->getDuration()); ?></td>
                        <td><?php echo $timeslot->getDescription(); ?></td>
                        <td><?php 
                            $isValidated = $timeslot->getIsValidated();
                            if($isValidated == 2){?>
                                 <button type="button" class="btn btn-warning"><i class="fa-solid fa-clock"></i> En attente</button>
                            <?php }
                            elseif($isValidated == 0){ ?>
                                <button type="button" class="btn btn-danger"><i class="fa-solid fa-xmark"></i> Refusé</button>
                            <?php }
                            else { ?>
                                 <button type="button" class="btn btn-success"><i class="fa-solid fa-check"></i> Validé</button>
                            <?php } ?>
                        </td>
                        <td>
                            <form method="POST" action="/espaceperso/delete">
                                <input class="d-none" name="idDelete" value="<?= $timeslot->getId() ?>">
                                <button type="submit" class="btn"><i class="fa-solid fa-xmark"></i></button>
                            </form>
                        </td>
                    </tr>
                <?php } ?>
             
            </tbody>
        </table>
        <?php } ?>

        <h3 class="" style="text-align: left; margin-top: 2%;">Votre historique complet</h3>
        <hr>
        <a href="/changepassword" style="text-decoration: none;"><button type="button" class="btn btn-outline-warning">Changer mon mot de passe</button></a>
        <a href="/historique" target="_blank" style="text-decoration: none;"><button type="button" class="btn btn-outline-secondary">Consulter l'historique</button></a>



    </div>


</body>
