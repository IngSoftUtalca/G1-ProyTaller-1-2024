<?php
/* Validar que sesión no haya expirado */
session_start();
if (!isset($_SESSION['sso'])) {
    session_unset();
    session_destroy();
    // Ubicación de archivo -> inter.php.
    Header("Location: inter.php");
}else{
    $id = $_SESSION['id'];
    $mainpage = file_get_contents('../ENPOINTS.json');
    $mainpage = json_decode($mainpage, true);
    $mainpage = $mainpage['mainpage'];
    $mainpage = $mainpage."/docente"."/".$id;
    header("location:".$mainpage);
}
?>