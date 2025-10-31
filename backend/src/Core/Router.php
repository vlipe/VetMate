<?php
namespace App\Core;

class Router {
  private array $routes = [];
  private array $middlewares = [];

  public function add(string $method, string $pattern, callable $handler, array $middlewares=[]): void {
    $this->routes[] = [$method, $this->compile($pattern), $handler, $middlewares];
  }

  public function group(string $prefix, callable $fn, array $middlewares=[]): void {
    $prev = $this->middlewares;
    $this->middlewares = array_merge($this->middlewares, $middlewares);
    $fn(new class($this, $prefix) {
      private $router; private $prefix;
      public function __construct($r,$p){$this->router=$r;$this->prefix=$p;}
      public function add($m,$p,$h,$mw=[]){ $this->router->add($m, $this->prefix.$p, $h, $mw); }
      public function get($p,$h,$mw=[]){ $this->add('GET',$p,$h,$mw); }
      public function post($p,$h,$mw=[]){ $this->add('POST',$p,$h,$mw); }
      public function put($p,$h,$mw=[]){ $this->add('PUT',$p,$h,$mw); }
      public function patch($p,$h,$mw=[]){ $this->add('PATCH',$p,$h,$mw); }
      public function delete($p,$h,$mw=[]){ $this->add('DELETE',$p,$h,$mw); }
    });
    $this->middlewares = $prev;
  }

  public function dispatch(Request $req) {
    $allowedMethodsForPath = [];
    foreach ($this->routes as [$method, $route, $handler, $mws]) {
      if (preg_match($route['regex'], $req->path, $m)) {
        // registro que esse path existe para esse método
        $allowedMethodsForPath[] = $method;

        // método bateu → executa handler com middlewares
        if ($method === $req->method) {
          $req->params = [];
          foreach ($route['keys'] as $i=>$key) $req->params[$key] = $m[$i+1] ?? null;
          $stack = array_merge($this->middlewares, $mws);
          $next = function() use (&$next, &$stack, $handler, $req) {
            if ($mw = array_shift($stack)) return $mw($req, $next);
            return $handler($req);
          };
          return $next();
        }
      }
    }

    if (!empty($allowedMethodsForPath)) {
      // caminho existe, mas método não permitido
      header('Allow: ' . implode(', ', array_unique($allowedMethodsForPath)));
      Response::json(['error'=>['message'=>'Method Not Allowed']], 405);
      return;
    }

    Response::json(['error'=>['message'=>'Not Found']], 404);
  }

  private function compile(string $pattern): array {
    $keys = [];
    $regex = preg_replace_callback('#:(\w+)#', function($m) use (&$keys){ $keys[]=$m[1]; return '([^/]+)';}, $pattern);
    $regex = '#^' . rtrim($regex,'/') . '/?$#';
    return ['regex'=>$regex, 'keys'=>$keys];
  }
}
