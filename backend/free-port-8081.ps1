param(
    [int]$Port = 8081
)

function Write-Note { param($m) Write-Host "[NOTE] $m" -ForegroundColor Cyan }
function Write-Warn { param($m) Write-Host "[WARN] $m" -ForegroundColor Yellow }
function Write-Err { param($m) Write-Host "[ERROR] $m" -ForegroundColor Red }

Write-Host "Detectando processos escutando na porta $Port..." -ForegroundColor Green

# tenta Get-NetTCPConnection (PowerShell 3+), senão usa netstat
$connections = @()
try {
    $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction Stop
} catch {
    # fallback para netstat parse
    Write-Note "Get-NetTCPConnection não disponível ou falhou — usando netstat como fallback."
    $lines = (netstat -ano | Select-String ":$Port") | ForEach-Object { $_.ToString() }
    foreach ($l in $lines) {
        # formato:  TCP    0.0.0.0:8080           0.0.0.0:0              LISTENING       4452
        $parts = $l -split '\s+' | Where-Object { $_ -ne '' }
        if ($parts.Count -ge 5) {
            $proto = $parts[0]
            $local = $parts[1]
            $state = if ($parts.Count -eq 5) { $parts[3] } else { $parts[3] }
            $pid = $parts[-1]
            $connections += [PSCustomObject]@{ LocalAddress = $local; State = $state; OwningProcess = [int]$pid }
        }
    }
}

if (!$connections -or $connections.Count -eq 0) {
    Write-Host "Nenhum processo escutando na porta $Port. Nenhuma ação necessária." -ForegroundColor Green
    exit 0
}

# normalize to list of PIDs
$pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique

$items = @()
foreach ($p in $pids) {
    $proc = $null
    try { $proc = Get-Process -Id $p -ErrorAction Stop } catch { }
    $svc = Get-CimInstance Win32_Service | Where-Object { $_.ProcessId -eq $p }

    $items += [PSCustomObject]@{
        PID = $p
        ProcessName = if ($proc) { $proc.ProcessName } else { '<unknown>' }
        Path = if ($proc) { ($proc.Path) -join '' } else { '' }
        ServiceName = if ($svc) { $svc.Name } else { '' }
        ServiceDisplay = if ($svc) { $svc.DisplayName } else { '' }
        ServiceState = if ($svc) { $svc.State } else { '' }
    }
}

Write-Host ""
Write-Host "Resumo dos processos na porta ${Port}:" -ForegroundColor Cyan
$items | Format-Table PID,ProcessName,ServiceName,ServiceState,ServiceDisplay -AutoSize

# ação interativa para cada item
foreach ($it in $items) {
    Write-Host "\n--- PID: $($it.PID) - $($it.ProcessName) ---" -ForegroundColor Magenta
    if ($it.ServiceName) {
        Write-Host "Processo ligado a serviço: $($it.ServiceName) ($($it.ServiceDisplay)) - Estado: $($it.ServiceState)"
        $choice = Read-Host "Escolha ação: [S]top service temporariamente / [D]isable service (parar+desabilitar) / [K]ill process / [I]gnore"
        switch ($choice.ToUpper()) {
            'S' {
                try {
                    Write-Host "Parando serviço $($it.ServiceName)..."
                    Stop-Service -Name $it.ServiceName -Force -ErrorAction Stop
                    Write-Host "Serviço parado."
                } catch { Write-Warn "Falha ao parar serviço: $($_.Exception.Message)" }
            }
            'D' {
                try {
                    Write-Host "Parando serviço $($it.ServiceName) e desabilitando..."
                    Stop-Service -Name $it.ServiceName -Force -ErrorAction Stop
                    Set-Service -Name $it.ServiceName -StartupType Disabled -ErrorAction Stop
                    Write-Host "Serviço parado e desabilitado no boot."
                } catch { Write-Warn "Falha ao parar/desabilitar serviço: $($_.Exception.Message)" }
            }
            'K' {
                try {
                    Write-Host "Matando processo PID $($it.PID)..."
                    Stop-Process -Id $it.PID -Force -ErrorAction Stop
                    Write-Host "Processo terminado."
                } catch { Write-Warn "Falha ao matar processo: $($_.Exception.Message)" }
            }
            default {
                Write-Host "Ignorando PID $($it.PID)." -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "Processo sem serviço associado: $($it.ProcessName) Path: $($it.Path)"
        $choice = Read-Host "Escolha ação: [K]ill process / [I]gnore"
        if ($choice.ToUpper() -eq 'K') {
            try {
                Write-Host "Matando processo PID $($it.PID)..."
                Stop-Process -Id $it.PID -Force -ErrorAction Stop
                Write-Host "Processo terminado."
            } catch { Write-Warn "Falha ao matar processo: $($_.Exception.Message)" }
        } else {
            Write-Host "Ignorando PID $($it.PID)." -ForegroundColor Yellow
        }
    }
}

# mostrar estado final
Write-Host "" 
Write-Host "Verificando porta ${Port} novamente..." -ForegroundColor Cyan
Start-Sleep -Seconds 1
netstat -ano | Select-String ":$Port" | ForEach-Object { $_.ToString() } | Write-Host

Write-Host "" 
Write-Host "Se a porta ficou livre, reinicie seu servidor de desenvolvimento com: .\\backend\\start-dev.ps1" -ForegroundColor Green

# Pergunta se deve reiniciar automaticamente o servidor embutido do PHP
$restart = Read-Host "Deseja iniciar o PHP built-in server agora na porta ${Port}? [S/n]"
if ($restart -eq '' -or $restart.ToUpper() -eq 'S' -or $restart.ToUpper() -eq 'Y') {
    try {
        $public = Join-Path $PSScriptRoot 'public'
        Write-Host "Iniciando PHP built-in server em http://localhost:${Port} (nova janela)..." -ForegroundColor Green
        $cmd = "php -S localhost:${Port} -t '$public'"
        Start-Process -FilePath powershell -ArgumentList "-NoExit -Command $cmd"
        Write-Host "Servidor iniciado em nova janela PowerShell." -ForegroundColor Green
    } catch {
        Write-Warn "Falha ao iniciar servidor: $($_.Exception.Message)"
    }
} else {
    Write-Host "Ok — não iniciando o servidor." -ForegroundColor Yellow
}
