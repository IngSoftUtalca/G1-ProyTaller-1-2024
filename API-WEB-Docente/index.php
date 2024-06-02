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
    

    if(!$ver){
        $webdocente = $webdocente."/claseinicio"."/".$id."?sala=".$_SESSION['sala']; 
        header("location:".$webdocente);
    }else{
        if($id == $ver){
            // Indica los métodos permitidos.
            header('Access-Control-Allow-Methods: GET, POST, DELETE');

            header('Access-Control-Allow-Headers: Authorization');
            http_response_code(204);

            
        }else{
            $webdocente = $webdocente."/".$_SESSION['sala']; 
            header("location:".$webdocente);
        }
    }

}
?>