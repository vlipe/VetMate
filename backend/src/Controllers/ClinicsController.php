<?php
namespace App\Controllers;

use App\Repositories\ClinicsRepository;
use App\Support\Cnpj;

class ClinicsController {
  public function __construct(private ClinicsRepository $repo){}

  public function list(): array {
    return $this->repo->listAll();
  }

  public function get(int $id): array {
    $c = $this->repo->findById($id);
    if (!$c) throw new \RuntimeException('Not found', 404);
    unset($c['password_hash']);
    return $c;
  }

  // PUT (completo)
  public function update(int $id, array $b): array {
    if (isset($b['cnpj'])) {
      $b['cnpj'] = Cnpj::normalize((string)$b['cnpj']);
      // Para validação estrita aqui, troque por: $b['cnpj'] = Cnpj::assertValid((string)$b['cnpj'], true);
    }
    if (isset($b['cep'])) {
      $b['cep'] = preg_replace('/\D+/', '', (string)$b['cep']);
    }
    foreach (['cnpj','corporate_name','email'] as $r) {
      if (!isset($b[$r]) || $b[$r]==='') throw new \RuntimeException("Missing field: $r", 400);
    }
    $this->repo->update($id, $b);
    $c = $this->repo->findById($id);
    if (!$c) throw new \RuntimeException('Not found', 404);
    unset($c['password_hash']);
    return $c;
  }

  // PATCH (parcial)
  public function patch(int $id, array $b): array {
    if (isset($b['cnpj'])) {
      $b['cnpj'] = Cnpj::normalize((string)$b['cnpj']);
      // Para validação estrita: $b['cnpj'] = Cnpj::assertValid((string)$b['cnpj'], true);
    }
    if (isset($b['cep'])) {
      $b['cep'] = preg_replace('/\D+/', '', (string)$b['cep']);
    }
    if (!$b) throw new \RuntimeException('Empty body', 400);
    $this->repo->updatePartial($id, $b);
    $c = $this->repo->findById($id);
    if (!$c) throw new \RuntimeException('Not found', 404);
    unset($c['password_hash']);
    return $c;
  }

  public function delete(int $id): array {
    $this->repo->delete($id);
    return ['ok'=>true];
  }
}
