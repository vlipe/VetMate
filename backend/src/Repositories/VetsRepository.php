<?php
namespace App\Repositories;
use App\Db\SqlServer;

class VetsRepository {
  public function __construct(private SqlServer $db){}
  public function list(): array {
    $st = $this->db->query("SELECT * FROM Vets ORDER BY name");
    return $this->db->fetchAll($st);
  }
  public function create(array $d): int {
  $stmt = $this->db->query(
    "INSERT INTO Vets(name,crmvet,specialty,phone,email)
     OUTPUT INSERTED.id
     VALUES (?,?,?,?,?)",
    [$d['name'], $d['crmvet'] ?? null, $d['specialty'] ?? null, $d['phone'] ?? null, $d['email'] ?? null]
  );
  $rows = $this->db->fetchAll($stmt);
  return isset($rows[0]['id']) ? (int)$rows[0]['id'] : 0;
}

  public function find(int $id): ?array {
    $st = $this->db->query("SELECT * FROM Vets WHERE id=?", [$id]);
    $rows = $this->db->fetchAll($st); return $rows[0] ?? null;
  }
  public function update(int $id, array $d): void {
    $this->db->query("UPDATE Vets SET name=?, crmvet=?, specialty=?, phone=?, email=? WHERE id=?",
      [$d['name']??null,$d['crmvet']??null,$d['specialty']??null,$d['phone']??null,$d['email']??null,$id]);
  }
  public function delete(int $id): void {
    $this->db->query("DELETE FROM Vets WHERE id=?", [$id]);
  }
}
