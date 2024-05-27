<?php
/* Validar que sesión no haya expirado */
session_start();
$_SESSION['sala']= $_GET['sala'];
if (!isset($_SESSION['sso'])) {
    session_unset();
    session_destroy();

    session_start(); // se crea una mini sesion para que la variable sala sea persistente a los intentos de sesion 
    $_SESSION['sala']= $_GET['sala'];
    // Ubicación de archivo -> inter.php.
    Header("Location: inter.php" );
}else{
    $id = $_SESSION['id'];
    $webdocente = file_get_contents('../ENPOINTS.json');
    $webdocente = json_decode($webdocente, true);
    $webdocente = $webdocente['webdocente'];
    $webdocente = $webdocente."/claseinicio"."/".$id."?sala=".$_SESSION['sala']; // aca podia redirigirse a la pagina qr enviandole el rut 
    header("location:".$webdocente);
}
?>