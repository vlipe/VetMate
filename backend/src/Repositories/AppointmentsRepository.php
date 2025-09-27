<?php
namespace App\Repositories;
use App\Db\SqlServer;

class AppointmentsRepository {
  public function __construct(private SqlServer $db){}
  public function listForOwner(int $ownerId): array {
    $st = $this->db->query("""SELECT a.*, p.name AS pet_name, v.name AS vet_name
      FROM Appointments a
      JOIN Pets p ON p.id=a.pet_id
      LEFT JOIN Vets v ON v.id=a.vet_id
      WHERE p.owner_id = ?
      ORDER BY a.date_time DESC""", [$ownerId]);
    return $this->db->fetchAll($st);
  }
  public function create(array $d): int {
  $stmt = $this->db->query(
    "INSERT INTO Appointments(pet_id,vet_id,date_time,reason,status)
     OUTPUT INSERTED.id
     VALUES (?,?,?,?,?)",
    [$d['pet_id'], $d['vet_id'] ?? null, $d['date_time'], $d['reason'], 'scheduled']
  );
  $rows = $this->db->fetchAll($stmt);
  return isset($rows[0]['id']) ? (int)$rows[0]['id'] : 0;
}

  public function belongsToOwner(int $id, int $ownerId): bool {
    $st = $this->db->query("SELECT a.id FROM Appointments a JOIN Pets p ON p.id=a.pet_id WHERE a.id=? AND p.owner_id=?", [$id,$ownerId]);
    return !!$this->db->fetchAll($st);
  }
  public function find(int $id): ?array {
    $st = $this->db->query("SELECT * FROM Appointments WHERE id=?", [$id]);
    $rows = $this->db->fetchAll($st); return $rows[0] ?? null;
  }
  public function update(int $id, array $d): void {
    $this->db->query("UPDATE Appointments SET pet_id=?, vet_id=?, date_time=?, reason=?, status=? WHERE id=?",
      [$d['pet_id']??null,$d['vet_id']??null,$d['date_time']??null,$d['reason']??null,$d['status']??null,$id]);
  }
  public function delete(int $id): void {
    $this->db->query("DELETE FROM Appointments WHERE id=?", [$id]);
  }
}
