<?php

    /* Por favor no modificar estas variables */ 
    $id = isset($_GET['id']) ? $_GET['id'] : false;
    $v = isset($_GET['v']) ? $_GET['v'] : false;
    /* -------------------------------------- */

    function loadEnv($path){
        if(!file_exists($path)){
            return false;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach($lines as $line){
            if (strpos(trim($line), '#') === 0) {
                continue;
            }
            list($name, $value) = explode('=', $line,2);
            $name = trim($name);
            $value = trim($value);

            if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                putenv(sprintf('%s=%s', $name, $value));
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }

    session_start();
    $sala = $_SESSION['sala']; // se salva la variable

    $webdocente = file_get_contents('../ENPOINTS.json');
    $webdocente = json_decode($webdocente, true);
    $webdocente = $webdocente['webdocente'];
    // aca podia redirigirse a la pagina qr enviandole el rut 
    $webdocente = $webdocente."/claseinicio"."/".$id."?sala=".$sala;

    if (!$id) {
        /* Redirección a aplicativo de inicio de sesión - ¡NO MODIFICAR! */
        $url = urlencode(( $_SERVER['HTTPS'] ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
        header("location: https://huemul.utalca.cl/sso/login.php?url=".$url);
        /* ----------------------------------------------------------- */
    } elseif ($v) {
        session_destroy(); // se termina la sesion especial
        /* Configuración de sesión - Según lo requerido en el sistema, tener en cuenta que sesión del IDP-SP dura 25 min*/
        error_reporting(-1);
        ini_set('display_errors', 'On');
        ini_set('session.gc_maxlifetime','900');
        ini_set('session.cookie_lifetime','900');
        session_start();
        $_SESSION['id'] = $id;
        $_SESSION['sso'] = true;

        $cipher = "aes-128-gcm";

        $options = 0;

        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($cipher));
        $tag = "";
        $tagLength = 16;

        $FLAG = getenv('FLAG');
        $KEY = getenv('KEY');

        if (empty($FLAG) || empty($KEY)) {
            error_log("No se han definido las variables de entorno FLAG o KEY");
        }

        $encryptedFlag = openssl_encrypt($FLAG, $cipher, $KEY, $options, $iv, $tag, "", $tagLength);

        if ($encryptedFlag === false) {
            error_log("Error al encriptar la bandera");
        }

        $encodedTag = base64_encode($tag);
        $encodedIv = base64_encode($iv);

        $webdocente .= "&flag=" . $encryptedFlag . "&iv=" . $encodedIv . "&tag=" . $encodedTag;

        error_log("Redireccion: ".$webdocente);



        /*-------------------------*/ 
        /* Link de página de inicio sistema a loguear - Modificable*/
        header("location:".$webdocente);
        /* ------------------------------------------ */
    }

?>