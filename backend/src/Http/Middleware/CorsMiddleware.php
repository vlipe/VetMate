<?php
namespace App\Http\Middleware;
use App\Core\Request;

class CorsMiddleware {
  public function __construct(private array $cfg){}
  public function __invoke(Request $req, callable $next){
    $origins = $this->cfg['allowed_origins'];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && in_array($origin, $origins)) {
      header("Access-Control-Allow-Origin: $origin");
      header("Vary: Origin");
      header("Access-Control-Allow-Credentials: true");
    }
    header("Access-Control-Allow-Headers: " . implode(',', $this->cfg['allowed_headers']));
    header("Access-Control-Allow-Methods: " . implode(',', $this->cfg['allowed_methods']));
    if ($req->method === 'OPTIONS') { http_response_code(204); exit; }
    return $next();
  }
}
