<?php
return [
  'db' => [
    'host' => '127.0.0.1',
    'port' => 1433,
    'database' => 'VetMate',
    'user' => 'vetmate_user',        // ou 'sa' se preferir
    'password' => 'SenhaFort3!',     // ajuste para a senha que definiu
    'encrypt' => true,
    'trust_server_certificate' => true
  ],
  'jwt' => [
    'secret' => 'um-segredo-bem-forte',
    'issuer' => 'vetmate-backend',
    'audience' => 'vetmate-frontend',
    'expires_in' => 60*60*24*7
  ],
  'cors' => [
    'allowed_origins' => ['http://localhost:5173','http://127.0.0.1:5173','http://localhost:3000'],
    'allowed_headers' => ['Content-Type','Authorization'],
    'allowed_methods' => ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
  ]
];
