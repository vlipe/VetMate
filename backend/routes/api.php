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

    // /me
    $api->get('/me', function (Request $req) {
      Response::json([
        'user' => [
          'id'    => intval($req->user['sub'] ?? $req->user['id'] ?? 0),
          'name'  => $req->user['name']  ?? '',
          'email' => $req->user['email'] ?? '',
          'role'  => $req->user['role']  ?? 'user',
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
