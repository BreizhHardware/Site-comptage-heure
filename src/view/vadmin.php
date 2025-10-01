<?php require_once "header.php"; ?>
<?php if (isset($_SESSION['user']) && $_SESSION['user']->getIsAdmin()) { ?>
    <a href="?action=adduser" class="btn btn-primary" style="margin-bottom: 20px;">Créer un utilisateur</a>
<?php } ?>
<div style="margin: 2%;">

<h3 class="" style="">Consulter un historique</h3>
<hr>

<form method="POST" action="/admin/historique" style="display: flex; flex-direction: row;">
    <select class="form-select" aria-label="Default select example" style="width: 20%;" name="idUserToInspect">
    <option value="0" selected>Sélectionner un membre</option>
    <?php foreach($allUsers as $user) { ?>
        <option value="<?= $user->getId() ?>"><?= $user->getName() . " " . strtoupper($user->getSurname())?></option>
    <?php 
    }?>
    </select>

    <button type="submit" class="btn btn-outline-secondary">Consulter</button>
</form>

<h3 class="" style="text-align: left; margin-top: 2%;">Ajouts à valider</h3>
        <hr>
        <?php if(!empty($timeslotsToValidate)){ ?>
        <table class="table">
            <thead class="thead-dark">
                <tr>
                <th scope="col">id</th>
                <th scope="col">Personne</th>
                <th scope="col">Date</th>
                <th scope="col">Durée</th>
                <th scope="col">Description</th>
                <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($timeslotsToValidate as $timeslot){ 
    
                    ?>
                    <tr>
                        <td scope="row"><?php echo $timeslot->getId(); ?></td>
                        <td>
                            <div class="ms-3">
                                <p class="fw-bold mb-1"><?=$timeslot->getUser()->getName() . " " . strtoupper($timeslot->getUser()->getSurname()). " " . $timeslot->getUser()->getCycle() ?></p> 
                                <p class="text-muted mb-0"><?=$timeslot->getUser()->getMail()?> </p>
                                <p class="text-muted mb-0"><?=$timeslot->getUser()->getSpeciality()->getType()?> </p>
                            </div>
                        </td>
                        <td><?php echo $timeslot->getDate()->format("l j M"); ?></td>
                        <td><?php echo $utils->convertDecimalToHours($timeslot->getDuration()); ?></td>
                        <td><?php echo $timeslot->getDescription(); ?></td>
                        <td>
                            <div style="display: flex; flex-direction: row; gap: 5%;">
                                <form method="POST" action="/admin/validate">
                                    <input class="d-none" name="idValidate" value="<?= $timeslot->getId() ?>">
                                    <button type="submit" class="btn btn-success"><i class="fa-solid fa-check"></i> Valider</button>
                                </form>
                                <form method="POST" action="/admin/refuse">
                                    <input class="d-none" name="idRefuse" value="<?= $timeslot->getId() ?>">
                                    <button type="submit" class="btn btn-danger"><i class="fa-solid fa-xmark"></i> Refuser</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                <?php } ?>
             
            </tbody>
        </table>
        <?php } ?>

        <h3 class="" style="text-align: left; margin-top: 2%;">Dernières actions</h3>
        <hr>



</div>