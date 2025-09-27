<?php
namespace App\Core;

class Request {
  public string $method;
  public string $path;
  public array $headers;
  public array $query;
  public array $params = [];
  public array $body;
  public ?array $user = null;   // <<< importante para sumir o deprecated

  public function __construct() {
    $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $this->path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
    $this->path = rtrim($this->path, '/') ?: '/';
    $this->headers = function_exists('getallheaders') ? (getallheaders() ?: []) : [];
    $this->query = $_GET ?? [];
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    $this->body = is_array($data) ? $data : [];
  }

  public function bearerToken(): ?string {
    $auth = $this->headers['Authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    if (preg_match('/^Bearer\s+(.*)$/i', $auth, $m)) return trim($m[1]);
    return null;
  }
}
