<?php
declare(strict_types=1);

// ==================== CORS (primeiro de tudo) ====================
$allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
];

// origem do front (VSCode Live Server, etc.)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origin && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
    
} else {
  
    header('Access-Control-Allow-Origin: *');
}

// métodos e headers aceitos
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Max-Age: 86400');

// Pré-flight: responde e encerra ANTES de qualquer require
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}
// ==================== FIM CORS ====================

// === Request logger (útil para depuração local) ===
// registra method, uri, headers e corpo em ../logs/requests.log
try {
    $logDir = __DIR__ . '/../logs';
    if (!is_dir($logDir)) @mkdir($logDir, 0775, true);
    $logFile = $logDir . '/requests.log';
    $body = file_get_contents('php://input') ?: '';
    $entry = [
        'time' => date(DATE_ATOM),
        'method' => $_SERVER['REQUEST_METHOD'] ?? '',
        'uri' => $_SERVER['REQUEST_URI'] ?? '',
        'script' => $_SERVER['SCRIPT_NAME'] ?? '',
        'headers' => function_exists('getallheaders') ? (getallheaders() ?: []) : [],
        'body' => $body,
        'remote' => $_SERVER['REMOTE_ADDR'] ?? null,
    ];
    @file_put_contents($logFile, json_encode($entry, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES) . PHP_EOL, FILE_APPEND | LOCK_EX);
} catch (Throwable $e) {
    // não atrapalha execução se falhar
}


require __DIR__.'/../src/Core/Autoload.php';

use App\Core\Request;
use App\Core\Router;
use App\Core\Response;

date_default_timezone_set('America/Sao_Paulo');

$config = require __DIR__ . '/../config/config.php';
if (file_exists(__DIR__ . '/../config/config.local.php')) {
    $config = array_replace_recursive($config, require __DIR__ . '/../config/config.local.php');
}

set_exception_handler(function (Throwable $e) {
    $code = $e->getCode();
    $status = ($code >= 400 && $code <= 599) ? $code : 500;
    Response::json(['error' => ['message' => $e->getMessage()]], $status);
});

$router = new Router();
$routes = require __DIR__ . '/../routes/api.php';
$routes($router, $config);

$req = new Request();
$router->dispatch($req);
