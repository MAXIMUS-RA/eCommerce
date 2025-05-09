<?php
session_start();
require_once 'config.php';
require_once 'Autoloader.php';


use Core\Router;
use Core\Database;


$db = Database::getInstance();
BaseModel::setConnection($db->getConnection());


$staticRoutesConfig = [
    'GET' => [
        '/' => ['controller' => 'ProductsController', 'action' => 'home'],
        '/register' => ['controller' => 'AuthController', 'action' => 'showRegister'],
        '/login' => ['controller' => 'AuthController', 'action' => 'showLogin'],
        '/products' => ['controller' => 'ProductsController', 'action' => 'index'],
        '/cart' => ['controller' => 'CartController', 'action' => 'index'],
        '/admin/dashboard' => ['controller' => 'DashboardController', 'action' => 'index'],
        '/admin/products/create' => ['controller' => 'ProductsController', 'action' => 'create'],
        '/admin/categories' => ['controller' => 'CategoriesController', 'action' => 'index']
    ],
    'POST' => [
        '/register' => ['controller' => 'AuthController', 'action' => 'register'],
        '/login' => ['controller' => 'AuthController', 'action' => 'login'],
        '/logout' => ['controller' => 'AuthController', 'action' => 'logout'],
        '/admin/products/store' => ['controller' => 'ProductsController', 'action' => 'store'],
        '/cart/add' => ['controller' => 'CartController', 'action' => 'add']
    ]
];

$dynamicRoutePatternsConfig = [
    'GET' => [
        "#^/products/(?P<id>\d+)$#" => [
            'controller' => 'ProductsController',
            'action' => 'show'
        ],
    ],
    'POST' => []
];

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$router = new Router();
$router->loadRoutes($staticRoutesConfig, $dynamicRoutePatternsConfig);

try {
    $router->direct($uri, $method);
} catch (Exception $e) {
    error_log("Помилка маршрутизації: " . $e->getMessage() . " для URI: " . $uri . " Метод: " . $method);
    header("HTTP/1.0 500 Internal Server Error");
    echo "Сталася помилка: " . htmlspecialchars($e->getMessage());
    exit;
}
