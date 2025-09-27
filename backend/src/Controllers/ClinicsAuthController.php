<?php
namespace App\Controllers;

use App\Repositories\ClinicsRepository;
use App\Security\Jwt;
use App\Support\Cnpj;

class ClinicsAuthController {
  private bool $strictCnpj;

  public function __construct(
    private ClinicsRepository $clinics,
    private array $jwtCfg,
    ?bool $strictCnpj = null
  ){
    $this->strictCnpj = $strictCnpj ?? true;
  }

  public function register(array $b) {
    foreach (['cnpj','corporate_name','email','password'] as $r) {
      if (empty($b[$r])) throw new \RuntimeException("Missing field: $r", 400);
    }

    // Normaliza e valida CNPJ
    $cnpj = Cnpj::assertValid((string)$b['cnpj'], $this->strictCnpj);

    if ($this->clinics->findByEmail($b['email'])) {
      throw new \RuntimeException('Email already in use', 409);
    }
    if ($this->clinics->findByCnpj($cnpj)) {
      throw new \RuntimeException('CNPJ already in use', 409);
    }

    $b['cnpj'] = $cnpj; // salvar apenas dígitos
    // Normalizar CEP opcionalmente para só dígitos
    if (isset($b['cep'])) {
      $b['cep'] = preg_replace('/\D+/', '', (string)$b['cep']);
    }

    $id = $this->clinics->create($b, password_hash($b['password'], PASSWORD_BCRYPT));

    return [
      'id' => $id,
      'cnpj' => $cnpj,
      'corporate_name' => $b['corporate_name'],
      'email' => $b['email']
    ];
  }

  public function login(array $b) {
    foreach (['email','password'] as $r) {
      if (empty($b[$r])) throw new \RuntimeException("Missing field: $r", 400);
    }
    $c = $this->clinics->findByEmail($b['email']);
    if (!$c || !password_verify($b['password'], $c['password_hash'])) {
      throw new \RuntimeException('Invalid credentials', 401);
    }

    $now = time();
    $payload = [
      'sub' => (string)$c['id'],
      'type' => 'clinic',
      'corporate_name' => $c['corporate_name'],
      'email' => $c['email'],
      'iat' => $now,
      'exp' => $now + $this->jwtCfg['expires_in'],
      'iss' => $this->jwtCfg['issuer'],
      'aud' => $this->jwtCfg['audience']
    ];
    $token = Jwt::sign($payload, $this->jwtCfg);

    return [
      'token' => $token,
      'clinic' => [
        'id' => $c['id'],
        'corporate_name' => $c['corporate_name'],
        'email' => $c['email'],
        'type' => 'clinic'
      ]
    ];
  }
}
