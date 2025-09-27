<?php
namespace App\Controllers;
use App\Repositories\VetsRepository;

class VetsController {
  public function __construct(private VetsRepository $repo){}
  public function list(){ return $this->repo->list(); }
  public function create(array $b){
    if (empty($b['name'])) throw new \RuntimeException('Missing field: name',400);
    $id = $this->repo->create($b);
    return $this->repo->find($id) ?? ['id'=>$id];
  }
  public function update(int $id, array $b){
    if (!$this->repo->find($id)) throw new \RuntimeException('Not found',404);
    $this->repo->update($id,$b);
    return $this->repo->find($id);
  }
  public function delete(int $id){ $this->repo->delete($id); return ['ok'=>true]; }
}
