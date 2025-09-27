<?php
namespace App\Controllers;
use App\Repositories\UsersRepository;

class UsersController {
  public function __construct(private UsersRepository $users){}

  private function assertCanRead(int $actorId, string $role, int $targetId): void {
    if ($role !== 'admin' && $actorId !== $targetId) {
      throw new \RuntimeException('Forbidden', 403);
    }
  }

  private function assertCanWrite(int $actorId, string $role, int $targetId): void {
    if ($role !== 'admin' && $actorId !== $targetId) {
      throw new \RuntimeException('Forbidden', 403);
    }
  }

  public function list(string $role): array {
    if ($role !== 'admin') throw new \RuntimeException('Forbidden', 403);
    return $this->users->listAll();
  }

  public function get(int $actorId, string $role, int $id): array {
    $this->assertCanRead($actorId, $role, $id);
    $u = $this->users->findById($id);
    if (!$u) throw new \RuntimeException('Not found', 404);
    unset($u['password_hash']);
    return $u;
  }

  // PUT (completo – senha opcional)
  public function update(int $actorId, string $role, int $id, array $b): array {
    $this->assertCanWrite($actorId, $role, $id);
    foreach (['name','email'] as $r) {
      if (!isset($b[$r]) || $b[$r]==='') throw new \RuntimeException("Missing field: $r", 400);
    }
    if ($role !== 'admin') {
      // usuário comum não pode se promover
      unset($b['role']);
    }
    $this->users->update($id, $b);
    $u = $this->users->findById($id);
    if (!$u) throw new \RuntimeException('Not found', 404);
    unset($u['password_hash']);
    return $u;
  }

  // PATCH (parcial)
  public function patch(int $actorId, string $role, int $id, array $b): array {
    $this->assertCanWrite($actorId, $role, $id);
    if ($role !== 'admin') {
      unset($b['role']);
    }
    // se não veio nada pra alterar:
    if (!$b) throw new \RuntimeException('Empty body', 400);

    $this->users->updatePartial($id, $b);
    $u = $this->users->findById($id);
    if (!$u) throw new \RuntimeException('Not found', 404);
    unset($u['password_hash']);
    return $u;
  }

  public function delete(int $actorId, string $role, int $id): array {
    $this->assertCanWrite($actorId, $role, $id);
    $this->users->delete($id);
    return ['ok'=>true];
  }
}
