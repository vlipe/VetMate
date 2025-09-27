<?php
namespace App\Db;

class SqlServer {
  private $conn;
  public function __construct(array $cfg) {
    $info = [
      "Database" => $cfg['database'],
      "UID" => $cfg['user'],
      "PWD" => $cfg['password'],
      "Encrypt" => $cfg['encrypt'] ? 1 : 0,
      "TrustServerCertificate" => $cfg['trust_server_certificate'] ? 1 : 0,
      "CharacterSet" => "UTF-8"
    ];
    $server = $cfg['host'] . "," . $cfg['port'];
    $this->conn = sqlsrv_connect($server, $info);
    if (!$this->conn) {
      $e = sqlsrv_errors(); $msg = $e ? $e[0]['message'] : 'SQLSRV connect failed';
      throw new \RuntimeException($msg, 500);
    }
  }
  public function query(string $sql, array $params=[]){
    $stmt = sqlsrv_prepare($this->conn, $sql, array_values($params));
    if (!$stmt) { $e=sqlsrv_errors(); throw new \RuntimeException(($e?$e[0]['message']:'prepare failed'),500); }
    if (!sqlsrv_execute($stmt)) { $e=sqlsrv_errors(); throw new \RuntimeException(($e?$e[0]['message']:'execute failed'),500); }
    return $stmt;
  }
  public function fetchAll($stmt): array {
    $rows=[];
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
      foreach ($row as $k=>$v) if ($v instanceof \DateTime) $row[$k]=$v->format(DATE_ATOM);
      $rows[]=$row;
    }
    return $rows;
  }
  public function lastInsertId(): ?int {
    $stmt = $this->query("SELECT CAST(SCOPE_IDENTITY() AS INT) AS id");
    $rows = $this->fetchAll($stmt);
    return isset($rows[0]['id']) ? (int)$rows[0]['id'] : null;
}


}
