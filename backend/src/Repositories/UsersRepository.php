<?php
namespace App\Repositories;
use App\Db\SqlServer;

class UsersRepository {
  public function __construct(private SqlServer $db) {}

  public function findByEmail(string $email): ?array {
    $st   = $this->db->query("SELECT TOP 1 * FROM Users WHERE email = ?", [$email]);
    $rows = $this->db->fetchAll($st);
    return $rows[0] ?? null;
  }

 public function findById(int $id): ?array {
  $st   = $this->db->query(
    "SELECT id, name, email, role, avatar_url FROM Users WHERE id = ?",
    [ $id ]
  );
  $rows = $this->db->fetchAll($st);
  return $rows[0] ?? null;
}

public function updateById(int $id, array $fields): bool {
  if (!$fields) return true;
  $sets = [];
  $params = [];
  foreach ($fields as $k => $v) {
    $sets[] = "$k = ?";
    $params[] = $v;
  }
  $params[] = $id;
  $sql = "UPDATE Users SET ".implode(', ', $sets)." WHERE id = ?";
  $st  = $this->db->query($sql, $params);
  return true;
}


  public function listAll(): array {
    $st = $this->db->query("SELECT id, name, email, role, created_at FROM Users ORDER BY id DESC");
    return $this->db->fetchAll($st);
  }

  public function create(string $name, string $email, string $hash, string $role='user'): int {
    // Mantém OUTPUT INSERTED.id (funciona com SQL Server)
    $st = $this->db->query(
      "INSERT INTO Users (name,email,password_hash,role)
       OUTPUT INSERTED.id
       VALUES (?,?,?,?)",
      [$name, $email, $hash, $role]
    );
    $rows = $this->db->fetchAll($st);
    return isset($rows[0]['id']) ? (int)$rows[0]['id'] : 0;
  }

  // PUT (com senha opcional)
  public function update(int $id, array $d): void {
    $this->db->query(
      "UPDATE Users
          SET name = ?,
              email = ?,
              role = ?,
              password_hash = COALESCE(?, password_hash)
        WHERE id = ?",
      [
        $d['name']  ?? null,
        $d['email'] ?? null,
        $d['role']  ?? 'user',
        isset($d['password']) && $d['password'] !== ''
          ? password_hash($d['password'], PASSWORD_BCRYPT)
          : null,
        $id
      ]
    );
  }

  // PATCH (parcial)
  public function updatePartial(int $id, array $d): void {
    $this->db->query(
      "UPDATE Users
          SET name          = COALESCE(?, name),
              email         = COALESCE(?, email),
              role          = COALESCE(?, role),
              password_hash = COALESCE(?, password_hash)
        WHERE id = ?",
      [
        $d['name']  ?? null,
        $d['email'] ?? null,
        $d['role']  ?? null,
        isset($d['password']) && $d['password'] !== ''
          ? password_hash($d['password'], PASSWORD_BCRYPT)
          : null,
        $id
      ]
    );
  }

  public function delete(int $id): void {
    $this->db->query("DELETE FROM Users WHERE id = ?", [$id]);
  }
}
