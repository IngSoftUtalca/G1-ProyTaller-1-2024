<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

session_start();

if (!isset($_SESSION['sso'])) {
    session_unset();
    session_destroy();

    $id = isset($_GET['id']) ? $_GET['id'] : false;
    $v = isset($_GET['v']) ? $_GET['v'] : false;

    if (!$id) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Sesión no válida o expirada.',
            'valid' => false,
        ]);
    } elseif ($v) {
        error_reporting(-1);
        ini_set('display_errors', 'On');
        ini_set('session.gc_maxlifetime','900');
        ini_set('session.cookie_lifetime','900');
        session_start();
        $_SESSION['id'] = $id;
        $_SESSION['sso'] = true;

        echo json_encode([
            'status' => 'success',
            'message' => $id,
            'valid' => true
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Sesión no válida o expirada.',
            'valid' => false,
        ]);
    }
} else {
    $id = $_SESSION['id'];

    echo json_encode([
        'status' => 'success',
        'message' => $id,
        'valid' => true
    ]);
}
?>