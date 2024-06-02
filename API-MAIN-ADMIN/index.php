<?php
/* Validar que sesión no haya expirado */
session_start();


$ver = isset($_GET['ver']) ? $_GET['ver'] : false;


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
    

    if(!$ver){
        $mainpage = $mainpage."/administrador"."/".$id;
        header("location:".$mainpage);
    }else{
        if($id == $ver){
            // Indica los métodos permitidos.
            header('Access-Control-Allow-Methods: GET, POST, DELETE');

            header('Access-Control-Allow-Headers: Authorization');
            http_response_code(204);
        }else{
            header("location:".$mainpage);
        }
    }
}
?>