param(
	[int]$Port = 8081
)

# Inicia o servidor de desenvolvimento PHP apontando para o public
# Uso: abra PowerShell na pasta raiz do repo e rode: .\backend\start-dev.ps1
$public = Join-Path $PSScriptRoot 'public'
Write-Host "Iniciando PHP built-in server em http://localhost:$Port com document root: $public"
php -S "localhost:$Port" -t $public
