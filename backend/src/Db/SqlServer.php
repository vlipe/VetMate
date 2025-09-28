<?php
namespace App\Db;

class SqlServer {
  private $conn;

  public function __construct(array $cfg) {
    $info = [
      "Database" => $cfg['database'],
      "UID"      => $cfg['user'],
      "PWD"      => $cfg['password'],
      "Encrypt"  => !empty($cfg['encrypt']) ? 1 : 0,
      "TrustServerCertificate" => !empty($cfg['trust_server_certificate']) ? 1 : 0,
      "CharacterSet" => "UTF-8",
    ];
    $server = $cfg['host'] . "," . $cfg['port'];
    $this->conn = sqlsrv_connect($server, $info);
    if (!$this->conn) {
      $e = sqlsrv_errors(); $msg = $e ? $e[0]['message'] : 'SQLSRV connect failed';
      throw new \RuntimeException($msg, 500);
    }
  }

  /** Executa (prepare+execute) e retorna o statement */
  public function query(string $sql, array $params = []) {
    // IMPORTANTe: sqlsrv_* usa APENAS ?, não suporta :nome
    $stmt = sqlsrv_prepare($this->conn, $sql, array_values($params));
    if (!$stmt) {
      $e = sqlsrv_errors();
      throw new \RuntimeException(($e ? $e[0]['message'] : 'prepare failed'), 500);
    }
    if (!sqlsrv_execute($stmt)) {
      $e = sqlsrv_errors();
      throw new \RuntimeException(($e ? $e[0]['message'] : 'execute failed'), 500);
    }
    return $stmt;
  }

  /** Retorna TODAS as linhas */
  public function fetchAll($stmt): array {
    $rows = [];
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
      foreach ($row as $k => $v) {
        if ($v instanceof \DateTimeInterface) {
          $row[$k] = $v->format(DATE_ATOM);
        }
      }
      $rows[] = $row;
    }
    return $rows;
  }

  /** Retorna UMA linha (ou null) */
  public function fetchOne(string $sql, array $params = []): ?array {
    $stmt = $this->query($sql, $params);
    $rows = $this->fetchAll($stmt);
    return $rows[0] ?? null;
  }

  /** Executa comando DML e retorna linhas afetadas */
  public function execute(string $sql, array $params = []): int {
    $stmt = $this->query($sql, $params);
    $n = sqlsrv_rows_affected($stmt);
    return $n === false ? 0 : (int)$n;
  }

  /** Último ID inserido (para IDENTITY) */
  public function lastInsertId(): ?int {
    $stmt = $this->query("SELECT CAST(SCOPE_IDENTITY() AS INT) AS id");
    $rows = $this->fetchAll($stmt);
    return isset($rows[0]['id']) ? (int)$rows[0]['id'] : null;
  }
}
