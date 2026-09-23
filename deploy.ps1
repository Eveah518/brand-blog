# Brand博客 → Cloudflare Pages 部署脚本（wrangler Direct Upload 模式，无需 GitHub 仓库）
# 运行前请先设置环境变量（不要把 Token 写死在此文件中）：
#   $env:CLOUDFLARE_API_TOKEN = "你的API Token"
#   $env:CLOUDFLARE_ACCOUNT_ID = "你的Account ID"
$ErrorActionPreference = "Stop"

$hugo     = "C:\tools\hugo\hugo.exe"
$projDir  = "C:\Users\dhq\Desktop\网站开发\Brand博客"
$wrangler = "C:\Users\dhq\.workbuddy\binaries\node\workspace\node_modules\.bin\wrangler.cmd"
$projName = "brand-blog"

# 关键：清空本机代理环境变量，否则沙箱/Clash 类代理会改写 Authorization 头导致 9109 鉴权失败
$env:HTTP_PROXY  = ""
$env:HTTPS_PROXY = ""
$env:ALL_PROXY   = ""
$env:NO_PROXY    = "*"

if (-not $env:CLOUDFLARE_API_TOKEN -or -not $env:CLOUDFLARE_ACCOUNT_ID) {
    Write-Error "请先设置 CLOUDFLARE_API_TOKEN 和 CLOUDFLARE_ACCOUNT_ID 环境变量"
    exit 1
}

# 1) 本地构建
Set-Location $projDir
& $hugo --minify -d public
if ($LASTEXITCODE -ne 0) { Write-Error "Hugo 构建失败"; exit 1 }

# 2) 确保 Pages 项目存在（已存在时会报错，忽略即可）
& $wrangler pages project create $projName --production-branch main 2>$null

# 3) 直传到 Cloudflare Pages（项目已存在时直接部署）
& $wrangler pages deploy public --project-name $projName --branch main --commit-dirty=true
if ($LASTEXITCODE -ne 0) { Write-Error "Wrangler 部署失败"; exit 1 }

Write-Output "部署完成 -> https://$projName.pages.dev"
