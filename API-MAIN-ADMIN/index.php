<?php
/* Validar que sesión no haya expirado */
session_start();
if (!isset($_SESSION['sso'])) {
    session_unset();
    session_destroy();
    // Ubicación de archivo -> inter.php.
    Header("Location: inter.php");
}else{
    header("Location: inter.php?id=".$_SESSION['id']."&v=1");
}
?>