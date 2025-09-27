<?php
namespace App\Http\Middleware;
use App\Core\Request;
use App\Security\Jwt;

class AuthMiddleware {
  public function __construct(private array $jwtCfg){}
  public function __invoke(Request $req, callable $next){
    $token = $req->bearerToken();
    if (!$token) throw new \RuntimeException('Missing Authorization header', 401);
    $req->user = Jwt::verify($token, $this->jwtCfg);
    return $next();
  }
}
