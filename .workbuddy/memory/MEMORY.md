# Brand博客 项目记忆

- **技术栈**：Hugo（静态站）+ Lumenveil 主题 + Cloudflare Pages 部署。主题要求 Hugo Extended ≥ 0.146.0。
- **主题引入方式**：vendored 目录 `themes/lumenveil`（锁定 v0.2.2），非 git submodule（沙箱环境 git submodule 不可用，改为 clone 后剥离 .git）。更新主题需重新 clone 指定版本并删 .git 后提交。
- **Cloudflare Pages 构建**：命令 `hugo --minify`，输出目录 `public`，环境变量 `HUGO_VERSION=0.146.0`（自动用 Extended 版）。
- **站内搜索**：依赖构建生成的 `/index.json`，由 `hugo.toml` 的 `[outputs]` 开启 home JSON（务必保留）。
- **本地环境**：工作机未安装 Hugo，无法本地构建/预览；构建与预览需在本机装 Hugo Extended 或在 Cloudflare 完成。
- **沙箱注意**：本机 Git 的 shell 子命令（submodule 等）因缺 coreutils 失败；含中文路径的 `git -C` 在 bash 下解析失败，需用 PowerShell 处理 git。
