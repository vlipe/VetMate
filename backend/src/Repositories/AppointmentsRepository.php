<?php
namespace App\Repositories;

use App\Db\SqlServer;

class AppointmentsRepository {
  public function __construct(private SqlServer $db){}

  /** Lista consultas do dono (join com Pets e Vets) */
  public function listByOwner(int $ownerId): array {
    $sql = <<<SQL
      SELECT 
        a.*,
        p.name AS pet_name,
        v.name AS vet_name
      FROM Appointments a
      JOIN Pets p ON p.id = a.pet_id
      LEFT JOIN Vets v ON v.id = a.vet_id
      WHERE p.owner_id = ?
      ORDER BY a.date_time DESC
    SQL;
    $st = $this->db->query($sql, [$ownerId]);
    return $this->db->fetchAll($st);
  }

  /** Busca uma consulta garantindo que o pet é do owner */
  public function findOwned(int $id, int $ownerId): ?array {
    $sql = <<<SQL
      SELECT 
        a.*,
        p.name AS pet_name,
        v.name AS vet_name
      FROM Appointments a
      JOIN Pets p ON p.id = a.pet_id
      LEFT JOIN Vets v ON v.id = a.vet_id
      WHERE a.id = ? AND p.owner_id = ?
    SQL;
    $st = $this->db->query($sql, [$id, $ownerId]);
    $rows = $this->db->fetchAll($st);
    return $rows[0] ?? null;
  }

  /** Cria consulta */
  public function create(array $d): int {
    $sql = <<<SQL
      INSERT INTO Appointments (pet_id, vet_id, date_time, reason, status)
      OUTPUT INSERTED.id
      VALUES (?, ?, ?, ?, ?)
    SQL;
    $st = $this->db->query($sql, [
      (int)$d['pet_id'],
      isset($d['vet_id']) ? (int)$d['vet_id'] : null,
      $d['date_time'],                 // 'YYYY-MM-DDTHH:MM' ou 'YYYY-MM-DD HH:MM'
      $d['reason'],
      $d['status'] ?? 'scheduled',
    ]);
    $rows = $this->db->fetchAll($st);
    return isset($rows[0]['id']) ? (int)$rows[0]['id'] : 0;
  }

  /** Atualização completa (PUT) */
  public function update(int $id, array $d, int $ownerId): void {
    // Só atualiza se a consulta pertence ao owner
    $sql = <<<SQL
      UPDATE a
         SET a.pet_id   = ?,
             a.vet_id   = ?,
             a.date_time= ?,
             a.reason   = ?,
             a.status   = ?
      FROM Appointments a
      JOIN Pets p ON p.id = a.pet_id
      WHERE a.id = ? AND p.owner_id = ?
    SQL;
    $this->db->query($sql, [
      (int)$d['pet_id'],
      isset($d['vet_id']) ? (int)$d['vet_id'] : null,
      $d['date_time'],
      $d['reason'],
      $d['status'] ?? 'scheduled',
      $id,
      $ownerId
    ]);
  }

  /** Atualização parcial (PATCH) */
  public function updatePartial(int $id, array $d, int $ownerId): void {
    $sql = <<<SQL
      UPDATE a
         SET a.pet_id    = COALESCE(?, a.pet_id),
             a.vet_id    = COALESCE(?, a.vet_id),
             a.date_time = COALESCE(?, a.date_time),
             a.reason    = COALESCE(?, a.reason),
             a.status    = COALESCE(?, a.status)
      FROM Appointments a
      JOIN Pets p ON p.id = a.pet_id
      WHERE a.id = ? AND p.owner_id = ?
    SQL;
    $this->db->query($sql, [
      isset($d['pet_id']) ? (int)$d['pet_id'] : null,
      array_key_exists('vet_id', $d) ? (int)$d['vet_id'] : null, // permite null explícito
      $d['date_time'] ?? null,
      $d['reason'] ?? null,
      $d['status'] ?? null,
      $id,
      $ownerId
    ]);
  }

  /** Exclui consulta do owner */
  public function delete(int $id, int $ownerId): void {
    $sql = <<<SQL
      DELETE a
      FROM Appointments a
      JOIN Pets p ON p.id = a.pet_id
      WHERE a.id = ? AND p.owner_id = ?
    SQL;
    $this->db->query($sql, [$id, $ownerId]);
  }
}
