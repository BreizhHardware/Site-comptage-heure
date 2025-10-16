<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Comptage d'heure</title>
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter">
    <script src="https://kit.fontawesome.com/5b8b37978c.js" crossorigin="anonymous"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/1.33.1/plotly.min.js" integrity="sha512-V0j9LhrK9IMNdFYZqh+IqU4cjo7wdxyHNyH+L0td4HryBuZ7Oq6QxP2/CWr6TituX31+gv5PnolvERuTbz8UNA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
   
</head>
<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-light bg-body-tertiary">
  <!-- Container wrapper -->
  <div class="container-fluid">
    <!-- Toggle button -->
    <button
      data-mdb-collapse-init
      class="navbar-toggler"
      type="button"
      data-mdb-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <i class="fas fa-bars"></i>
    </button>

    <!-- Collapsible wrapper -->
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <!-- Navbar brand -->
      <a class="navbar-brand mt-2 mt-lg-0" href="#">
        <img
          src="/assets/img/logo.png"
          height="50"
          alt="MDB Logo"
          loading="lazy"
          class="logoBDE"
        />
      </a>
      <!-- Left links -->
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="/accueil">Accueil</a>
        </li>
        <?php 
          if (session_status() === PHP_SESSION_NONE) {
            session_start();
          }
          if(isset($_SESSION["user"])){ ?>
            <li class="nav-item">
              <a class="nav-link" href="/espaceperso">Espace perso</a>
            </li>
          <?php
          }
          if(isset($_SESSION["user"]) && $_SESSION["user"]->getIsAdmin()){
            ?>
            <li class="nav-item">
              <a class="nav-link" href="/admin">Espace admin</a>
            </li>
            <?php
          }
        ?>
      </ul>
      <!-- Left links -->
    </div>
    <!-- Collapsible wrapper -->

    <!-- Right elements -->
    <div class="d-flex align-items-center" style="display: flex">
      <!-- Icon -->
        <?php 
           if (session_status() === PHP_SESSION_NONE) {
            session_start();
          }
          if(isset($_SESSION["user"])){ ?>
            <a class="text-reset me-3" href="/disconnect">
              <i class="fa-solid fa-xmark"></i>
            </a>
          <?php
          }
          else{ ?>
            <a class="text-reset me-3" href="/login">
              <i class="fa-solid fa-arrow-right-to-bracket"></i>
            </a>
          <?php
        }?>

        <?php 
            if (session_status() === PHP_SESSION_NONE) {
              session_start();
            }

            if(isset($_SESSION["user"])){
                $user = $_SESSION["user"];?>
                <a class="text-reset me-3" style="text-decoration: none">
                  <?= $user->getName() . " " . strtoupper($user->getSurname()) ?>
                </a>
            <?php
            }
            else { ?>
                <a class="text-reset me-3" href="/login" style="text-decoration: none">
                  <?= "Se connecter" ?>
                </a>
            <?php
            }
        ?>
    <!-- Right elements -->
  </div>
  <!-- Container wrapper -->
</nav>
<!-- Navbar -->
