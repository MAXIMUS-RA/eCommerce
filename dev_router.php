<?php

$publicPath = __DIR__ . '/public';


$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

error_log("[ROUTER] Request URI: " . $uri);
$requestedFile = $publicPath . $uri;
error_log("[ROUTER] Checking for file: " . $requestedFile);




if ($uri !== '/' && file_exists($requestedFile)) {
    error_log("[ROUTER] File exists. Attempting to serve directly: " . $requestedFile);


    $mimeType = mime_content_type($requestedFile);
    if ($mimeType) {
        header('Content-Type: ' . $mimeType);
    }
    header('Content-Length: ' . filesize($requestedFile));

    if (ob_get_level()) {
        ob_end_clean();
    }
    flush();
    readfile($requestedFile);
    exit;
} else {
    if ($uri !== '/') {
        error_log("[ROUTER] File does NOT exist or URI is '/'. Passing to server/index.php: " . $requestedFile);
    }
}

$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/server/index.php';
$_SERVER['SCRIPT_NAME'] = '/server/index.php';
$_SERVER['PHP_SELF'] = '/server/index.php';

require_once __DIR__ . '/server/index.php';
