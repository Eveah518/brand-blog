// Cloudflare Pages Function：处理 Decap CMS 的 GitHub OAuth 登录
// 单端点同时负责「发起授权」与「回调换 token」
// 环境变量（在 Cloudflare Pages 后台设置，或用 wrangler pages secret put）：
//   GITHUB_CLIENT_ID
//   GITHUB_CLIENT_SECRET
// GitHub OAuth App 的 Authorization callback URL 必须设为：https://brand-blog.pages.dev/api/oauth

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  const code = url.searchParams.get('code');

  // 第一步：没有 code → 重定向到 GitHub 授权页
  if (!code) {
    const redirectUri = url.origin + '/api/oauth';
    const ghUrl =
      'https://github.com/login/oauth/authorize?client_id=' +
      encodeURIComponent(clientId) +
      '&redirect_uri=' +
      encodeURIComponent(redirectUri) +
      '&scope=' +
      encodeURIComponent('repo');
    return Response.redirect(ghUrl, 302);
  }

  // 第二步：GitHub 回调带 code → 换取 access_token
  const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: url.origin + '/api/oauth',
    }),
  });
  const tokenData = await tokenResp.json();
  const token = tokenData.access_token;

  // 第三步：把 token 回传给打开的 Decap 弹窗
  const html =
    '<!doctype html><html><head><script>' +
    'window.opener.postMessage({ token: "' +
    token +
    '", provider: "github" }, window.location.origin);' +
    'window.close();' +
    '</script></head><body>登录中…</body></html>';
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
