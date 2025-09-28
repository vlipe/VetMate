<?php
use App\Core\Request;
use App\Core\Response;
use App\Core\Router;
use App\Db\SqlServer;
use App\Repositories\{UsersRepository,PetsRepository,VetsRepository,AppointmentsRepository};
use App\Controllers\{AuthController,PetsController,VetsController,AppointmentsController,UsersController};
use App\Http\Middleware\{CorsMiddleware,AuthMiddleware};
use App\Repositories\ClinicsRepository;
use App\Controllers\{ClinicsAuthController, ClinicsController};


return function (Router $router, array $config) {
  $db     = new SqlServer($config['db']);
  $corsMw = new CorsMiddleware($config['cors']);
  $authMw = new AuthMiddleware($config['jwt']);

  // ---------- Grupo público (/api) ----------
  $router->group('/api', function ($api) use ($db, $config) {

    // health
    $api->get('/health', function (Request $req) {
      Response::json(['ok' => true, 'time' => date(DATE_ATOM)]);
    });

    // auth
    $api->post('/auth/register', function (Request $req) use ($db, $config) {
      $ctl = new AuthController(new UsersRepository($db), $config['jwt']);
      Response::json($ctl->register($req->body), 201);
    });

    $api->post('/auth/login', function (Request $req) use ($db, $config) {
      $ctl = new AuthController(new UsersRepository($db), $config['jwt']);
      Response::json($ctl->login($req->body));
    });

  $api->post('/clinics/register', function (Request $req) use ($db, $config) {
  $strict = false; // mude para false em DEV se quiser aceitar qualquer 14 dígitos
  $ctl = new ClinicsAuthController(new ClinicsRepository($db), $config['jwt'], $strict);
  Response::json($ctl->register($req->body), 201);
});
$api->post('/clinics/login', function (Request $req) use ($db, $config) {
  $ctl = new ClinicsAuthController(new ClinicsRepository($db), $config['jwt']);
  Response::json($ctl->login($req->body));
});


    // vets (list público)
    $api->get('/vets', function (Request $req) use ($db) {
      $ctl = new VetsController(new VetsRepository($db));
      Response::json($ctl->list());
    });

  }, [ $corsMw ]);

  // ---------- Grupo protegido (/api) ----------
  $router->group('/api', function ($api) use ($db, $authMw) {

    // ---------- Perfil do usuário (edição parcial) ----------
// PATCH /api/user  → atualiza parcialmente (nome/email/senha)
$api->patch('/user', function (Request $req) use ($db) {
  $repo = new UsersRepository($db);
  $id   = intval($req->user['sub'] ?? $req->user['id'] ?? 0);

  $data = $req->body ?? [];
  $updates = [];

  if (isset($data['name']) && $data['name'] !== '')   $updates['name'] = trim($data['name']);
  if (isset($data['email']) && $data['email'] !== '') $updates['email'] = trim($data['email']);
  if (isset($data['password']) && $data['password'] !== '') {
    // armazena já como hash
    $updates['password_hash'] = password_hash($data['password'], PASSWORD_BCRYPT);
  }

  if ($updates) {
    $repo->updateById($id, $updates);
  }

  $user = $repo->findById($id);
  Response::json(['user' => $user]);
}, [ $authMw ]);

// POST /api/user/avatar  → upload do avatar (multipart/form-data)
$api->post('/user/avatar', function (App\Core\Request $req) use ($db) {
  $userId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
  if (!$userId) {
    App\Core\Response::json(['error'=>['message'=>'unauthorized']], 401);
    return;
  }

  if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
    App\Core\Response::json(['error'=>['message'=>'Arquivo não enviado']], 400);
    return;
  }

  $file = $_FILES['avatar'];

  // === validações ===
$maxBytes = 2 * 1024 * 1024; // 2MB
if ($file['size'] > $maxBytes) {
  App\Core\Response::json(['error'=>['message'=>'Arquivo até 2MB']], 413);
  return;
}

// tenta detectar o MIME com fallback
$mime = null;

// 1) fileinfo
if (function_exists('finfo_open')) {
  $fi = finfo_open(FILEINFO_MIME_TYPE);
  if ($fi) {
    $mime = finfo_file($fi, $file['tmp_name']) ?: null;
    finfo_close($fi);
  }
}

// 2) mime_content_type
if (!$mime && function_exists('mime_content_type')) {
  $mime = @mime_content_type($file['tmp_name']) ?: null;
}

// 3) getimagesize (último recurso)
if (!$mime) {
  $gi = @getimagesize($file['tmp_name']);
  if ($gi && isset($gi['mime'])) $mime = $gi['mime'];
}

$allowed = [
  'image/jpeg' => 'jpg',
  'image/png'  => 'png',
  'image/webp' => 'webp',
];

if (!$mime || !isset($allowed[$mime])) {
  App\Core\Response::json(['error'=>['message'=>'Formato inválido (jpg/png/webp)']], 415);
  return;
}

$ext = $allowed[$mime];


  // garante pasta
  $dstDir = __DIR__ . '/../../public/uploads/avatars';
  if (!is_dir($dstDir)) { @mkdir($dstDir, 0775, true); }

  $ext = $allowed[$mime];
  $fname   = sprintf('%d_%s.%s', $userId, bin2hex(random_bytes(8)), $ext);
  $dstPath = $dstDir . '/' . $fname;

  if (!move_uploaded_file($file['tmp_name'], $dstPath)) {
    App\Core\Response::json(['error'=>['message'=>'Falha ao salvar arquivo']], 500);
    return;
  }

  // monte a URL pública do backend (ajuste se necessário)
  $scheme = (!empty($_SERVER['REQUEST_SCHEME']) ? $_SERVER['REQUEST_SCHEME'] : 'http');
  $host   = $_SERVER['HTTP_HOST'] ?? 'localhost:8081'; // ex.: localhost:8081
  $base   = $scheme . '://' . $host;

  $publicUrl = $base . '/uploads/avatars/' . $fname;

  // grava no banco
  $repo = new App\Repositories\UsersRepository($db);
  $repo->updateById($userId, ['avatar_url' => $publicUrl]);

  App\Core\Response::json(['avatar_url' => $publicUrl], 201);
}, [ $authMw ]);




    // /me
   $api->get('/me', function (Request $req) use ($db) {
  $repo = new UsersRepository($db);
  $id = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
  $user = $repo->findById($id); // implemente se não tiver

  Response::json([
    'user' => [
      'id'         => (int)$user['id'],
      'name'       => $user['name'],
      'email'      => $user['email'],
      'role'       => $user['role'] ?? 'user',
      'avatar_url' => $user['avatar_url'] ?? null,
    ]
  ]);
}, [ $authMw ]);


    // ------ Users (tudo protegido) ------
    $api->get('/users', function (Request $req) use ($db) {
      $role = (string)($req->user['role'] ?? 'user');
      $ctl = new UsersController(new UsersRepository($db));
      Response::json($ctl->list($role));
    }, [ $authMw ]);

    $api->get('/users/:id', function (Request $req) use ($db) {
      $actorId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
      $role    = (string)($req->user['role'] ?? 'user');
      $id      = (int)$req->params['id'];
      $ctl = new UsersController(new UsersRepository($db));
      Response::json($ctl->get($actorId, $role, $id));
    }, [ $authMw ]);

    $api->put('/users/:id', function (Request $req) use ($db) {
      $actorId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
      $role    = (string)($req->user['role'] ?? 'user');
      $id      = (int)$req->params['id'];
      $ctl = new UsersController(new UsersRepository($db));
      Response::json($ctl->update($actorId, $role, $id, $req->body));
    }, [ $authMw ]);

    $api->patch('/users/:id', function (Request $req) use ($db) {
      $actorId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
      $role    = (string)($req->user['role'] ?? 'user');
      $id      = (int)$req->params['id'];
      $ctl = new UsersController(new UsersRepository($db));
      Response::json($ctl->patch($actorId, $role, $id, $req->body));
    }, [ $authMw ]);

    $api->delete('/users/:id', function (Request $req) use ($db) {
      $actorId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
      $role    = (string)($req->user['role'] ?? 'user');
      $id      = (int)$req->params['id'];
      $ctl = new UsersController(new UsersRepository($db));
      Response::json($ctl->delete($actorId, $role, $id));
    }, [ $authMw ]);

    

    // ------ Pets ------
    $api->get('/pets', function (Request $req) use ($db) {
      $ownerId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
      $ctl = new PetsController(new PetsRepository($db));
      Response::json($ctl->list($ownerId));
    }, [ $authMw ]);

    $api->post('/pets', function (Request $req) use ($db) {
      $ownerId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
      $ctl = new PetsController(new PetsRepository($db));
      Response::json($ctl->create($req->body, $ownerId), 201);
    }, [ $authMw ]);

    $api->put('/pets/:id', function (Request $req) use ($db) {
      $ownerId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
      $id = (int)$req->params['id'];
      $ctl = new PetsController(new PetsRepository($db));
      Response::json($ctl->update($id, $req->body, $ownerId));
    }, [ $authMw ]);

    $api->patch('/pets/:id', function (Request $req) use ($db) {
      $ownerId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
      $id = (int)$req->params['id'];
      $ctl = new PetsController(new PetsRepository($db));
      Response::json($ctl->patch($id, $req->body, $ownerId));
    }, [ $authMw ]);

    $api->delete('/pets/:id', function (Request $req) use ($db) {
      $ownerId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
      $id = (int)$req->params['id'];
      $ctl = new PetsController(new PetsRepository($db));
      Response::json($ctl->delete($id, $ownerId));
    }, [ $authMw ]);


   $api->get('/clinics', function (Request $req) use ($db) {
  $ctl = new ClinicsController(new ClinicsRepository($db));
  Response::json($ctl->list());
}, [ $authMw ]);

$api->get('/clinics/:id', function (Request $req) use ($db) {
  $id = (int)$req->params['id'];
  $ctl = new ClinicsController(new ClinicsRepository($db));
  Response::json($ctl->get($id));
}, [ $authMw ]);

$api->put('/clinics/:id', function (Request $req) use ($db) {
  $id = (int)$req->params['id'];
  $ctl = new ClinicsController(new ClinicsRepository($db));
  Response::json($ctl->update($id, $req->body));
}, [ $authMw ]);

$api->patch('/clinics/:id', function (Request $req) use ($db) {
  $id = (int)$req->params['id'];
  $ctl = new ClinicsController(new ClinicsRepository($db));
  Response::json($ctl->patch($id, $req->body));
}, [ $authMw ]);

$api->delete('/clinics/:id', function (Request $req) use ($db) {
  $id = (int)$req->params['id'];
  $ctl = new ClinicsController(new ClinicsRepository($db));
  Response::json($ctl->delete($id));
}, [ $authMw ]);


    // ------ Vets ------
    $api->post('/vets', function (Request $req) use ($db) {
      $ctl = new VetsController(new VetsRepository($db));
      Response::json($ctl->create($req->body), 201);
    }, [ $authMw ]);

    $api->put('/vets/:id', function (Request $req) use ($db) {
      $id = (int)$req->params['id'];
      $ctl = new VetsController(new VetsRepository($db));
      Response::json($ctl->update($id, $req->body));
    }, [ $authMw ]);

    $api->delete('/vets/:id', function (Request $req) use ($db) {
      $id = (int)$req->params['id'];
      $ctl = new VetsController(new VetsRepository($db));
      Response::json($ctl->delete($id));
    }, [ $authMw ]);

    // ------ Appointments ------
    $api->get('/appointments', function (Request $req) use ($db) {
      $ownerId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
      $ctl = new AppointmentsController(new AppointmentsRepository($db), new PetsRepository($db));
      Response::json($ctl->list($ownerId));
    }, [ $authMw ]);

    $api->post('/appointments', function (Request $req) use ($db) {
      $ownerId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
      $ctl = new AppointmentsController(new AppointmentsRepository($db), new PetsRepository($db));
      Response::json($ctl->create($req->body, $ownerId), 201);
    }, [ $authMw ]);

    $api->put('/appointments/:id', function (Request $req) use ($db) {
      $ownerId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
      $id = (int)$req->params['id'];
      $ctl = new AppointmentsController(new AppointmentsRepository($db), new PetsRepository($db));
      Response::json($ctl->update($id, $req->body, $ownerId));
    }, [ $authMw ]);

    $api->delete('/appointments/:id', function (Request $req) use ($db) {
      $ownerId = intval($req->user['sub'] ?? $req->user['id'] ?? 0);
      $id = (int)$req->params['id'];
      $ctl = new AppointmentsController(new AppointmentsRepository($db), new PetsRepository($db));
      Response::json($ctl->delete($id, $ownerId));
    }, [ $authMw ]);

  }, [ $corsMw, $authMw ]);
};
