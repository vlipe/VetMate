<?php
declare(strict_types=1);

require __DIR__.'/../src/Core/Autoload.php';

use App\Core\Request;
use App\Core\Router;
use App\Core\Response;

date_default_timezone_set('America/Sao_Paulo');

$config = require __DIR__ . '/../config/config.php';
if (file_exists(__DIR__ . '/../config/config.local.php')) {
  $config = array_replace_recursive($config, require __DIR__ . '/../config/config.local.php');
}

set_exception_handler(function(Throwable $e){
  $code = $e->getCode();
  $status = ($code >= 400 && $code <= 599) ? $code : 500;
  Response::json(['error'=>['message'=>$e->getMessage()]], $status);
});

$router = new Router();
$routes = require __DIR__ . '/../routes/api.php';
$routes($router, $config);
$req = new Request();
$router->dispatch($req);
