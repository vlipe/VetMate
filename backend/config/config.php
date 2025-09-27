<?php
return [
  'db' => [
    'host' => getenv('DB_HOST') ?: 'localhost',
    'port' => intval(getenv('DB_PORT') ?: 1433),
    'database' => getenv('DB_NAME') ?: 'VetMate',
    'user' => getenv('DB_USER') ?: 'sa',
    'password' => getenv('DB_PASSWORD') ?: 'YourStrong!Passw0rd',
    'encrypt' => true,
    'trust_server_certificate' => true
  ],
  'jwt' => [
    'secret' => getenv('JWT_SECRET') ?: 'change-this-secret',
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
