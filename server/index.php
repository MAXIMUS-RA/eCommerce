<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

error_log("INDEX.PHP TOP LEVEL TEST LOG - BEFORE ANYTHING ELSE");

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

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
        '/cart' => ['controller' => 'CartController', 'action' => 'viewCart'],
        '/admin/dashboard' => ['controller' => 'DashboardController', 'action' => 'index'],
        '/admin/products/create' => ['controller' => 'ProductsController', 'action' => 'create'],
        '/categories' => ['controller' => 'CategoriesController', 'action' => 'index'],
        '/users' => ['controller' => 'UsersController', 'action' => 'index'],
        '/auth/status' => ['controller' => 'AuthController', 'action' => 'status'],
        '/orders' => ['controller' => 'OrdersController', 'action' => 'getUserOrders'],
        '/admin/orders' => ['controller' => 'OrdersController', 'action' => 'getAllOrders'],

    ],
    'POST' => [
        '/register' => ['controller' => 'AuthController', 'action' => 'register'],
        '/login' => ['controller' => 'AuthController', 'action' => 'login'],
        '/logout' => ['controller' => 'AuthController', 'action' => 'logout'],
        '/admin/products/store' => ['controller' => 'ProductsController', 'action' => 'store'],
        '/cart/add' => ['controller' => 'CartController', 'action' => 'addItem'],
        '/cart/update' => ['controller' => 'CartController', 'action' => 'updateItem'],
        '/cart/remove' => ['controller' => 'CartController', 'action' => 'removeItem'],
        '/cart/clear' => ['controller' => 'CartController', 'action' => 'clearCart'],
        '/auth/register' => ['controller' => 'AuthController', 'action' => 'register'],
        '/auth/login' => ['controller' => 'AuthController', 'action' => 'login'],
        '/auth/logout' => ['controller' => 'AuthController', 'action' => 'logout'],
        '/categories/store' => ['controller' => 'CategoriesController', 'action' => 'store'],
        '/orders/store' => ['controller' => 'OrdersController', 'action' => 'createFromCart'],

        

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
