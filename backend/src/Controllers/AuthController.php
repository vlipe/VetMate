<?php
namespace App\Controllers;
use App\Repositories\UsersRepository;
use App\Security\Jwt;

class AuthController {
  public function __construct(private UsersRepository $users, private array $jwtCfg){}
  public function register(array $b){
    foreach (['name','email','password'] as $r) if (empty($b[$r])) throw new \RuntimeException("Missing field: $r",400);
    if ($this->users->findByEmail($b['email'])) throw new \RuntimeException('Email already in use',409);
    $id = $this->users->create($b['name'],$b['email'], password_hash($b['password'], PASSWORD_BCRYPT));
    return ['id'=>$id,'name'=>$b['name'],'email'=>$b['email']];
  }
  public function login(array $b){
    foreach (['email','password'] as $r) if (empty($b[$r])) throw new \RuntimeException("Missing field: $r",400);
    $u = $this->users->findByEmail($b['email']);
    if (!$u || !password_verify($b['password'], $u['password_hash'])) throw new \RuntimeException('Invalid credentials',401);
    $now = time();
    $payload = ['sub'=>(string)$u['id'],'name'=>$u['name'],'email'=>$u['email'],'role'=>$u['role'],'iat'=>$now,'exp'=>$now+$this->jwtCfg['expires_in'],'iss'=>$this->jwtCfg['issuer'],'aud'=>$this->jwtCfg['audience']];
    $token = Jwt::sign($payload, $this->jwtCfg);
    return ['token'=>$token,'user'=>['id'=>$u['id'],'name'=>$u['name'],'email'=>$u['email'],'role'=>$u['role']]];
  }
}
