<?php
namespace App\Controllers;
use App\Repositories\AppointmentsRepository;
use App\Repositories\PetsRepository;

class AppointmentsController {
  public function __construct(private AppointmentsRepository $repo, private PetsRepository $pets){}
  public function list(int $ownerId){ return $this->repo->listForOwner($ownerId); }
  public function create(array $b, int $ownerId){
    foreach (['pet_id','date_time','reason'] as $r) if (empty($b[$r])) throw new \RuntimeException("Missing field: $r",400);
    if (!$this->pets->findOwned((int)$b['pet_id'], $ownerId)) throw new \RuntimeException('Pet not found or not owned by user',403);
    $id = $this->repo->create($b);
    return $this->repo->find($id) ?? ['id'=>$id];
  }
  public function update(int $id, array $b, int $ownerId){
    if (!$this->repo->belongsToOwner($id,$ownerId)) throw new \RuntimeException('Not found',404);
    $this->repo->update($id,$b);
    return $this->repo->find($id);
  }
  public function delete(int $id, int $ownerId){
    if (!$this->repo->belongsToOwner($id,$ownerId)) throw new \RuntimeException('Not found',404);
    $this->repo->delete($id); return ['ok'=>true];
  }
}
