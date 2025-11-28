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

  public function uploadPhoto(int $petId, int $ownerId, ?array $file): array {
  if (!$petId) throw new \RuntimeException("Invalid pet id", 400);
  if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE)) {
    throw new \RuntimeException("No file uploaded", 400);
  }

  // Garante que o pet é do dono logado
  $pet = $this->repo->findOwned($petId, $ownerId);
  if (!$pet) throw new \RuntimeException("Pet not found", 404);

  // Valida MIME
  $allowed = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp'
  ];

  $fi = finfo_open(FILEINFO_MIME_TYPE);
  $mime = finfo_file($fi, $file['tmp_name']) ?: '';
  // Em PHP recente o finfo é fechado automaticamente; se seu linter reclamar do finfo_close, pode omitir sem problemas.
  // finfo_close($fi);

  if (!isset($allowed[$mime])) {
    throw new \RuntimeException("Unsupported file type", 415);
  }
  $ext = $allowed[$mime];

  // Caminho físico (ajuste conforme sua estrutura)
  $baseDir = __DIR__ . '/../../public/uploads/pets/' . $ownerId . '/' . $petId;
  if (!is_dir($baseDir) && !mkdir($baseDir, 0775, true)) {
    throw new \RuntimeException("Failed to create directory", 500);
  }

  $filename = 'photo.' . $ext;
  $dest = $baseDir . '/' . $filename;

  if (!move_uploaded_file($file['tmp_name'], $dest)) {
    throw new \RuntimeException("Failed to move file", 500);
  }

  // URL pública (ajuste a base pública do seu app)
  $publicBase = rtrim(getenv('PUBLIC_BASE') ?: 'http://localhost:8081', '/');
  $photoUrl   = $publicBase . '/uploads/pets/' . $ownerId . '/' . $petId . '/' . $filename;

  // Salva no banco
  $this->repo->updatePhoto($petId, $ownerId, $photoUrl, $filename);

  return [
    'id'            => $petId,
    'photo_url'     => $photoUrl,
    'photo_filename'=> $filename,
  ];
}

}
