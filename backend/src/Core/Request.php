<?php
namespace App\Core;

class Request {
  public string $method;
  public string $path;
  public array $headers;
  public array $query;
  public array $params = [];
  public array $body;
  public string $raw;
  public ?array $user = null;   

  public function __construct() {
    $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $this->path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
    $this->path = rtrim($this->path, '/') ?: '/';
    $this->headers = function_exists('getallheaders') ? (getallheaders() ?: []) : [];
    $this->query = $_GET ?? [];
    $raw = file_get_contents('php://input') ?: '';
    $this->raw = $raw;
    $data = json_decode($raw, true);
    $this->body = is_array($data) ? $data : [];
  }

  public function bearerToken(): ?string {
    $auth = $this->headers['Authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    if (preg_match('/^Bearer\s+(.*)$/i', $auth, $m)) return trim($m[1]);
    return null;
  }

   public function getBaseUrl(): string {
    // tenta respeitar proxy/reverso
    $proto = $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? null;
    $host  = $_SERVER['HTTP_X_FORWARDED_HOST']  ?? null;

    $scheme = $proto ?: (
      (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['SERVER_PORT'] ?? null) == 443
        ? 'https' : 'http'
    );

    $host = $host ?: ($_SERVER['HTTP_HOST'] ?? ($_SERVER['SERVER_NAME'] ?? 'localhost'));

    // se teu index.php fica em /public, a base é esse diretório
    $script = $_SERVER['SCRIPT_NAME'] ?? '';
    $basePath = rtrim(str_replace('\\','/', dirname($script)), '/');
    if ($basePath === '' || $basePath === '/') $basePath = '';

    return $scheme . '://' . $host . $basePath;
  }
}
