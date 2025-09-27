<?php
namespace App\Controllers;
use App\Repositories\PetsRepository;

class PetsController {
  public function __construct(private PetsRepository $repo){}

  public function list(int $ownerId){
    return $this->repo->listByOwner($ownerId);
  }

  public function create(array $b, int $ownerId){
    foreach (['name','species'] as $r) {
      if (empty($b[$r])) throw new \RuntimeException("Missing field: $r",400);
    }
    if (isset($b['weight_kg']) && !is_numeric($b['weight_kg'])) {
      throw new \RuntimeException("weight_kg must be numeric", 422);
    }
    if (isset($b['age_years']) && !is_numeric($b['age_years'])) {
      throw new \RuntimeException("age_years must be integer", 422);
    }
    $id = $this->repo->create($b, $ownerId);
    return $this->repo->findOwned($id, $ownerId) ?? ['id'=>$id];
  }

  // PUT (atualização completa)
  public function update(int $id, array $b, int $ownerId){
    if (!$this->repo->findOwned($id, $ownerId)) throw new \RuntimeException('Not found',404);
    if (isset($b['weight_kg']) && !is_numeric($b['weight_kg'])) {
      throw new \RuntimeException("weight_kg must be numeric", 422);
    }
    if (isset($b['age_years']) && !is_numeric($b['age_years'])) {
      throw new \RuntimeException("age_years must be integer", 422);
    }
    $this->repo->update($id,$b,$ownerId);
    return $this->repo->findOwned($id,$ownerId);
  }

  // PATCH (atualização parcial)
  public function patch(int $id, array $b, int $ownerId) {
    if (!$this->repo->findOwned($id, $ownerId)) throw new \RuntimeException('Not found',404);
    if (isset($b['weight_kg']) && !is_numeric($b['weight_kg'])) {
      throw new \RuntimeException("weight_kg must be numeric", 422);
    }
    if (isset($b['age_years']) && !is_numeric($b['age_years'])) {
      throw new \RuntimeException("age_years must be integer", 422);
    }
    $this->repo->updatePartial($id, $b, $ownerId);
    return $this->repo->findOwned($id, $ownerId);
  }

  public function delete(int $id, int $ownerId){
    if (!$this->repo->findOwned($id, $ownerId)) throw new \RuntimeException('Not found',404);
    $this->repo->delete($id,$ownerId);
    return ['ok'=>true];
  }
}
