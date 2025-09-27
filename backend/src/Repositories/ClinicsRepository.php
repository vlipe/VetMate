<?php
namespace App\Repositories;
use App\Db\SqlServer;

class ClinicsRepository {
  public function __construct(private SqlServer $db){}

  public function findById(int $id): ?array {
    $st = $this->db->query("SELECT TOP 1 * FROM Clinics WHERE id=?", [$id]);
    $rows = $this->db->fetchAll($st);
    return $rows[0] ?? null;
  }

  public function findByEmail(string $email): ?array {
    $st = $this->db->query("SELECT TOP 1 * FROM Clinics WHERE email=?", [$email]);
    $rows = $this->db->fetchAll($st);
    return $rows[0] ?? null;
  }

  public function findByCnpj(string $cnpjDigits): ?array {
    $st = $this->db->query("SELECT TOP 1 * FROM Clinics WHERE cnpj=?", [$cnpjDigits]);
    $rows = $this->db->fetchAll($st);
    return $rows[0] ?? null;
  }

  public function listAll(): array {
    $st = $this->db->query(
      "SELECT id, cnpj, corporate_name, trade_name, email, phone, city, state, cep, status, created_at
       FROM Clinics ORDER BY id DESC"
    );
    return $this->db->fetchAll($st);
  }

  public function create(array $d, string $pwdHash): int {
    $st = $this->db->query(
      "INSERT INTO Clinics
        (cnpj, corporate_name, trade_name, email, phone, password_hash,
         address_line1, address_line2, district, city, state, cep,
         opening_hours, latitude, longitude, status)
       OUTPUT INSERTED.id
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        $d['cnpj'],
        $d['corporate_name'],
        $d['trade_name']     ?? null,
        $d['email'],
        $d['phone']          ?? null,
        $pwdHash,
        $d['address_line1']  ?? null,
        $d['address_line2']  ?? null,
        $d['district']       ?? null,
        $d['city']           ?? null,
        $d['state']          ?? null,
        $d['cep']            ?? null,
        $d['opening_hours']  ?? null,
        isset($d['latitude'])  ? (float)$d['latitude']  : null,
        isset($d['longitude']) ? (float)$d['longitude'] : null,
        'active'
      ]
    );
    $rows = $this->db->fetchAll($st);
    return isset($rows[0]['id']) ? (int)$rows[0]['id'] : 0;
  }

  // PUT (completo – senha opcional)
  public function update(int $id, array $d): void {
    $this->db->query(
      "UPDATE Clinics
         SET cnpj=?, corporate_name=?, trade_name=?, email=?, phone=?,
             address_line1=?, address_line2=?, district=?, city=?, state=?, cep=?,
             opening_hours=?, latitude=?, longitude=?,
             password_hash = COALESCE(?, password_hash),
             status = COALESCE(?, status)
       WHERE id=?",
      [
        $d['cnpj'],
        $d['corporate_name'],
        $d['trade_name']     ?? null,
        $d['email'],
        $d['phone']          ?? null,
        $d['address_line1']  ?? null,
        $d['address_line2']  ?? null,
        $d['district']       ?? null,
        $d['city']           ?? null,
        $d['state']          ?? null,
        $d['cep']            ?? null,
        $d['opening_hours']  ?? null,
        isset($d['latitude'])  ? (float)$d['latitude']  : null,
        isset($d['longitude']) ? (float)$d['longitude'] : null,
        isset($d['password']) && $d['password'] !== '' ? password_hash($d['password'], PASSWORD_BCRYPT) : null,
        $d['status']         ?? null,
        $id
      ]
    );
  }

  // PATCH (parcial)
  public function updatePartial(int $id, array $d): void {
    $this->db->query(
      "UPDATE Clinics
         SET cnpj          = COALESCE(?, cnpj),
             corporate_name= COALESCE(?, corporate_name),
             trade_name    = COALESCE(?, trade_name),
             email         = COALESCE(?, email),
             phone         = COALESCE(?, phone),
             address_line1 = COALESCE(?, address_line1),
             address_line2 = COALESCE(?, address_line2),
             district      = COALESCE(?, district),
             city          = COALESCE(?, city),
             state         = COALESCE(?, state),
             cep           = COALESCE(?, cep),
             opening_hours = COALESCE(?, opening_hours),
             latitude      = COALESCE(?, latitude),
             longitude     = COALESCE(?, longitude),
             password_hash = COALESCE(?, password_hash),
             status        = COALESCE(?, status)
       WHERE id=?",
      [
        $d['cnpj']           ?? null,
        $d['corporate_name'] ?? null,
        $d['trade_name']     ?? null,
        $d['email']          ?? null,
        $d['phone']          ?? null,
        $d['address_line1']  ?? null,
        $d['address_line2']  ?? null,
        $d['district']       ?? null,
        $d['city']           ?? null,
        $d['state']          ?? null,
        $d['cep']            ?? null,
        $d['opening_hours']  ?? null,
        isset($d['latitude'])  ? (float)$d['latitude']  : null,
        isset($d['longitude']) ? (float)$d['longitude'] : null,
        isset($d['password']) && $d['password'] !== '' ? password_hash($d['password'], PASSWORD_BCRYPT) : null,
        $d['status']         ?? null,
        $id
      ]
    );
  }

  public function delete(int $id): void {
    $this->db->query("DELETE FROM Clinics WHERE id=?", [$id]);
  }
}
