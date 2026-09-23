# 部署到 Cloudflare Pages

本仓库已用 Lumenveil 主题（作为普通目录放在 `themes/lumenveil`，锁定 v0.2.2）搭好 Hugo 站点骨架，可直接推到 GitHub 后用 Cloudflare Pages 构建。

## 1. 推送到 GitHub

```bash
git remote add origin https://github.com/你的用户名/brand-blog.git
git add -A
git commit -m "init brand blog with lumenveil"
git push -u origin main
```

## 2. Cloudflare Pages 新建项目

- Cloudflare 控制台 → Workers & Pages → 创建 → Pages → 连接 Git 仓库
- 框架预设：**Hugo**（或手动填写）
- 构建命令：`hugo --minify`
- 输出目录：`public`

## 3. 环境变量（关键）

Settings → Environment variables 添加：

| 变量 | 值 | 说明 |
| --- | --- | --- |
| `HUGO_VERSION` | `0.146.0` | 主题要求 Extended ≥ 0.146.0，Cloudflare 会自动用 Extended 版 |

主题已在仓库内，构建时无需额外拉取 submodule。

## 4. 自定义域名（可选）

- Custom domains 绑定你的域名，按提示添加 DNS（CNAME 到 `<项目>.pages.dev`）。
- www 跳转主域名：取消 `static/_redirects` 里示例行的注释并改域名。

## 5. 本地预览（需自装 Hugo Extended）

```bash
hugo server -D
# 打开 http://localhost:1313/
```

## 主题更新

重新拉取指定版本，再删掉其 `.git` 并提交：

```bash
git clone --depth 1 --branch <新版本> https://github.com/Hansen1018/hugo-theme-lumenveil themes/lumenveil
Remove-Item -Recurse -Force themes/lumenveil/.git
git add -A && git commit -m "bump lumenveil"
```

## 说明

- 站内搜索依赖构建时生成的 `/index.json`，已由 `hugo.toml` 的 `[outputs]` 开启。
- 想换稳定版本：去 https://github.com/Hansen1018/hugo-theme-lumenveil/releases 看最新 tag。
