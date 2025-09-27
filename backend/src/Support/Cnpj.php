<?php
namespace App\Support;

final class Cnpj
{
  /** Remove tudo que não for dígito */
  public static function normalize(string $cnpj): string {
    return preg_replace('/\D+/', '', $cnpj) ?? '';
  }

  /** Valida tamanho + dígitos verificadores */
  public static function isValid(string $cnpj): bool {
    $cnpj = self::normalize($cnpj);
    if (strlen($cnpj) !== 14) return false;
    if (preg_match('/^(\d)\1{13}$/', $cnpj)) return false; // todos iguais

    $calc = function(string $base, int $len): int {
      $weights = $len === 12
        ? [5,4,3,2,9,8,7,6,5,4,3,2]
        : [6,5,4,3,2,9,8,7,6,5,4,3,2];
      $sum = 0;
      for ($i=0; $i<$len; $i++) $sum += (int)$base[$i] * $weights[$i];
      $rem = $sum % 11;
      return ($rem < 2) ? 0 : 11 - $rem;
    };

    $d1 = $calc($cnpj, 12);
    $d2 = $calc($cnpj, 13);
    return ((int)$cnpj[12] === $d1) && ((int)$cnpj[13] === $d2);
  }

  /**
   * Lança exceção se for inválido.
   * $strict=true => exige DV correto; $strict=false => aceita qualquer 14 dígitos (útil no DEV).
   */
  public static function assertValid(string $cnpj, bool $strict = true): string {
    $digits = self::normalize($cnpj);
    if (strlen($digits) !== 14) {
      throw new \RuntimeException('Invalid CNPJ (must have 14 digits)', 422);
    }
    if ($strict && !self::isValid($digits)) {
      throw new \RuntimeException('Invalid CNPJ', 422);
    }
    return $digits; // sempre retorna normalizado
  }
}
