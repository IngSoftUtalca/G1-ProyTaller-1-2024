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
    $webdocente = file_get_contents('../ENPOINTS.json');
    $webdocente = json_decode($webdocente, true);
    $webdocente = $webdocente['webdocente'];
    $webdocente = $webdocente."/qr"."/".$id; // aca podia redirigirse a la pagina qr enviandole el rut 
    header("location:".$webdocente);
}
?>