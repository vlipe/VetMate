<?php
declare(strict_types=1);

require __DIR__.'/../src/Core/Autoload.php';

use App\Core\Request;
use App\Core\Router;
use App\Core\Response;

date_default_timezone_set('America/Sao_Paulo');

// === CORS ===
$allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
} else {
    // Em DEV, pode liberar tudo (ajuste para PROD!)
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

// Pré-flight (OPTIONS) – responde e encerra
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// === Config ===
$config = require __DIR__ . '/../config/config.php';
if (file_exists(__DIR__ . '/../config/config.local.php')) {
    $config = array_replace_recursive($config, require __DIR__ . '/../config/config.local.php');
}

// === Tratador global de exceções (JSON) ===
set_exception_handler(function (Throwable $e) {
    $code = $e->getCode();
    $status = ($code >= 400 && $code <= 599) ? $code : 500;
    Response::json(['error' => ['message' => $e->getMessage()]], $status);
});

// === Router ===
$router = new Router();
$routes = require __DIR__ . '/../routes/api.php';
$routes($router, $config);

$req = new Request();
$router->dispatch($req);
