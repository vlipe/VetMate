<?php
namespace App\Security;

class Jwt {
  public static function b64e($d){ return rtrim(strtr(base64_encode($d), '+/', '-_'), '='); }
  public static function b64d($d){ return base64_decode(strtr($d, '-_', '+/')); }
  public static function sign(array $payload, array $cfg): string {
    $header = ['typ'=>'JWT','alg'=>'HS256'];
    $seg = [ self::b64e(json_encode($header)), self::b64e(json_encode($payload)) ];
    $sig = hash_hmac('sha256', implode('.', $seg), $cfg['secret'], true);
    $seg[] = self::b64e($sig);
    return implode('.', $seg);
  }
  public static function verify(string $jwt, array $cfg): array {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) throw new \RuntimeException('Invalid token', 401);
    [$h,$p,$s] = $parts;
    $expected = self::b64e(hash_hmac('sha256', "$h.$p", $cfg['secret'], true));
    if (!hash_equals($expected, $s)) throw new \RuntimeException('Invalid signature', 401);
    $payload = json_decode(self::b64d($p), true);
    if (!$payload) throw new \RuntimeException('Invalid payload', 401);
    if (isset($payload['exp']) && time() > $payload['exp']) throw new \RuntimeException('Token expired', 401);
    return $payload;
  }
}
