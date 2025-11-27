<?php
namespace App\Repositories;
use App\Db\SqlServer;

class PetsRepository {
  public function __construct(private SqlServer $db){}

  public function listByOwner(int $ownerId): array {
    $st = $this->db->query("SELECT * FROM Pets WHERE owner_id=? ORDER BY id DESC", [$ownerId]);
    return $this->db->fetchAll($st);
  }

  public function create(array $d, int $ownerId): int {
    $st = $this->db->query(
      "INSERT INTO Pets(owner_id,name,species,breed,birthdate,notes,sex,weight_kg,age_years,size,photo_url)
       OUTPUT INSERTED.id
       VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [
        $ownerId,
        $d['name'],
        $d['species'],
        $d['breed']      ?? null,
        $d['birthdate']  ?? null,
        $d['notes']      ?? null,
        $d['sex']        ?? null,
        isset($d['weight_kg']) ? (float)$d['weight_kg'] : null,
        isset($d['age_years']) ? (int)$d['age_years']   : null,
        $d['size'] ?? null,
        $d['photo_url'] ?? null
      ]
    );
    $rows = $this->db->fetchAll($st);
    return isset($rows[0]['id']) ? (int)$rows[0]['id'] : 0;
  }

  public function findOwned(int $id, int $ownerId): ?array {
    $st = $this->db->query("SELECT * FROM Pets WHERE id=? AND owner_id=?", [$id,$ownerId]);
    $rows = $this->db->fetchAll($st); 
    return $rows[0] ?? null;
  }

  public function update(int $id, array $d, int $ownerId): void {
    $this->db->query(
      "UPDATE Pets
         SET name=?,
             species=?,
             breed=?,
             birthdate=?,
             notes=?,
             sex=?,
             weight_kg=?,
             age_years=?,
             size=?
       WHERE id=? AND owner_id=?",
      [
        $d['name']       ?? null,
        $d['species']    ?? null,
        $d['breed']      ?? null,
        $d['birthdate']  ?? null,
        $d['notes']      ?? null,
        $d['sex']        ?? null,
        isset($d['weight_kg']) ? (float)$d['weight_kg'] : null,
        isset($d['age_years']) ? (int)$d['age_years']   : null,
        $d['size']       ?? null,
        $id,
        $ownerId
      ]
    );
  }

  public function updatePartial(int $id, array $d, int $ownerId): void {
  $this->db->query(
    "UPDATE Pets
       SET name       = COALESCE(?, name),
           species    = COALESCE(?, species),
           breed      = COALESCE(?, breed),
           birthdate  = COALESCE(?, birthdate),
           notes      = COALESCE(?, notes),
           sex        = COALESCE(?, sex),
           weight_kg  = COALESCE(?, weight_kg),
           age_years  = COALESCE(?, age_years),
           size       = COALESCE(?, size)
     WHERE id=? AND owner_id=?",
    [
      $d['name']       ?? null,
      $d['species']    ?? null,
      $d['breed']      ?? null,
      $d['birthdate']  ?? null,
      $d['notes']      ?? null,
      $d['sex']        ?? null,
      isset($d['weight_kg']) ? (float)$d['weight_kg'] : null,
      isset($d['age_years']) ? (int)$d['age_years']   : null,
      $d['size']       ?? null,
      $id,
      $ownerId
    ]
  );
}


  public function delete(int $id, int $ownerId): void {
    $this->db->query("DELETE FROM Pets WHERE id=? AND owner_id=?", [$id,$ownerId]);
  }

  public function updatePhoto(int $id, int $ownerId, string $url, string $filename): void {
  $this->db->query(
    "UPDATE Pets SET photo_url = ?, photo_filename = ? WHERE id = ? AND owner_id = ?",
    [$url, $filename, $id, $ownerId]
  );
}

}
