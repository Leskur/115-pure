# 115 OAuth2 PKCE 授权流程

本项目使用 PKCE (Proof Key for Code Exchange) 模式进行 OAuth2 授权，这是移动端和桌面端应用推荐的安全授权方式。

## 授权流程

```
┌─────────────┐                                    ┌──────────────┐
│   客户端     │ ─────(1) 生成 PKCE 参数──────────▶ │              │
│  (本应用)    │                                    │              │
│             │ ─────(2) 打开浏览器授权页面────────▶ │   115 授权    │
│             │         (携带 code_challenge)        │    服务器     │
│             │                                    │              │
│             │ ◀────(3) 用户扫码/登录授权────────── │              │
│             │         授权码通过 callback 返回       │              │
│             │                                    │              │
│             │ ─────(4) 用授权码换取 access_token──▶ │              │
│             │         (携带 code_verifier)         │              │
│             │ ◀────(5) 返回 token 信息──────────── │              │
└─────────────┘                                    └──────────────┘
```

## PKCE 参数说明

| 参数 | 说明 |
|------|------|
| `code_verifier` | 随机生成的 43-128 字符的字符串，客户端保存 |
| `code_challenge` | `BASE64URL(SHA256(code_verifier))` |
| `code_challenge_method` | 固定值 `S256` |
| `state` | 随机字符串，防止 CSRF 攻击 |

## 关键代码位置

- **PKCE 生成**: `src-tauri/src/auth.rs`
- **前端授权 Hook**: `src/hooks/useAuth.ts`
- **Token 存储**: `src/stores/authStore.ts`

## API 端点

### 1. 获取授权 URL
```
GET https://open.115.com/api/oauth/sso_login
```

参数：
- `client_id` - 应用 ID
- `redirect_uri` - 回调地址
- `state` - 防 CSRF 随机字符串
- `code_challenge` - PKCE code_challenge
- `code_challenge_method` - 固定值 `S256`

### 2. 换取 access_token
```
POST https://oauth.115.com/token
```

参数：
- `grant_type` - `authorization_code`
- `code` - 授权码
- `client_id` - 应用 ID
- `code_verifier` - PKCE code_verifier

### 3. 刷新 token
```
POST https://oauth.115.com/token
```

参数：
- `grant_type` - `refresh_token`
- `refresh_token` - 刷新令牌
- `client_id` - 应用 ID

## 参考文档

- [115 PKCE 授权文档](https://www.yuque.com/115yun/open/shtpzfhewv5nag11)
- [RFC 7636 - PKCE](https://tools.ietf.org/html/rfc7636)
