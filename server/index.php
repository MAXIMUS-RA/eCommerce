<?php
error_reporting(E_ALL);
ini_set('display_errors', 1); // Дуже важливо для розробки

error_log("INDEX.PHP TOP LEVEL TEST LOG - BEFORE ANYTHING ELSE");
// die("Testing if index.php is reached and logs are working."); // Розкоментуйте для перевірки

// Якщо попередній die() спрацював і лог з'явився, закоментуйте die() і продовжуйте

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
        '/admin/categories' => ['controller' => 'CategoriesController', 'action' => 'index'],
        '/users' => ['controller' => 'UsersController', 'action' => 'index'],
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
