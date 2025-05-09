<?php

spl_autoload_register(function (string $className) {
    $baseDir = __DIR__ . DIRECTORY_SEPARATOR;
    $file = $baseDir . str_replace('\\', DIRECTORY_SEPARATOR, $className) . '.php';

    if (file_exists($file)) {
        require_once $file;
        return;
    }

    $prefix = 'Core\\';
    if (strpos($className, $prefix) === 0) {
        $relative = substr($className, strlen($prefix));
        $file = $baseDir . 'core' . DIRECTORY_SEPARATOR . str_replace('\\', '/', $relative) . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }

    if (substr($className, -10) === 'Controller') {
        $file = $baseDir . 'controllers' . DIRECTORY_SEPARATOR . $className . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }

    $modelFile = $baseDir . 'models' . DIRECTORY_SEPARATOR . $className . '.php';
    if (file_exists($modelFile)) {
        require_once $modelFile;
        return;
    }

    $repoFile = $baseDir . 'repositories' . DIRECTORY_SEPARATOR . $className . '.php';
    if (file_exists($repoFile)) {
        require_once $repoFile;
        return;
    }
});
