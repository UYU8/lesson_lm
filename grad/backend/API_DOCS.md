# API 文档

## 认证相关 API

### 1. 用户注册

**请求**
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "user",
  "email": "user@example.com",
  "password": "password123"
}
```

**参数说明**
- `username` (string, required): 用户名，长度 3-255
- `email` (string, required): 邮箱地址
- `password` (string, required): 密码，长度至少 6

**响应**
```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "user": {
      "id": "uuid",
      "username": "user",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**错误响应**
- 400: 用户名已存在 / 邮箱已被注册
- 422: 参数验证失败

---

### 2. 用户登陆

**请求**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**参数说明**
- `email` (string, required): 邮箱地址
- `password` (string, required): 密码

**响应**
```json
{
  "code": 0,
  "message": "登陆成功",
  "data": {
    "user": {
      "id": "uuid",
      "username": "user",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**错误响应**
- 400: 邮箱或密码错误
- 422: 参数验证失败

---

### 3. 刷新 Token

**请求**
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**参数说明**
- `refreshToken` (string, required): 刷新令牌

**响应**
```json
{
  "code": 0,
  "message": "刷新成功",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**错误响应**
- 401: Refresh Token 无效 / 已过期
- 422: 参数验证失败

---

### 4. 获取当前用户信息

**请求**
```
GET /api/auth/me
Authorization: Bearer <accessToken>
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "uuid",
    "username": "user",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**错误响应**
- 401: 未提供认证令牌 / Token 已过期 / 无效的认证令牌
- 404: 用户不存在

---

### 5. 修改密码

**请求**
```
POST /api/auth/change-password
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "oldPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

**参数说明**
- `oldPassword` (string, required): 旧密码
- `newPassword` (string, required): 新密码，长度至少 6

**响应**
```json
{
  "code": 0,
  "message": "密码修改成功"
}
```

**错误响应**
- 400: 旧密码错误
- 401: 未提供认证令牌 / Token 已过期 / 无效的认证令牌
- 404: 用户不存在
- 422: 参数验证失败

---

### 6. 用户登出

**请求**
```
POST /api/auth/logout
Authorization: Bearer <accessToken>
X-Refresh-Token: <refreshToken>
```

**响应**
```json
{
  "code": 0,
  "message": "登出成功"
}
```

**错误响应**
- 401: 未提供认证令牌 / Token 已过期 / 无效的认证令牌

---

## JWT Token 说明

### Access Token
- **有效期**：15 分钟
- **用途**：用于访问受保护的 API
- **传递方式**：在请求头中使用 `Authorization: Bearer <token>`

### Refresh Token
- **有效期**：7 天
- **用途**：用于刷新 Access Token
- **存储**：保存在数据库中，用于验证和撤销

### Token 刷新流程
1. 当 Access Token 过期时，使用 Refresh Token 调用 `/api/auth/refresh` 接口
2. 服务器验证 Refresh Token 的有效性
3. 返回新的 Access Token
4. 客户端使用新的 Access Token 继续请求

### Token 撤销
- 用户登出时，服务器会撤销对应的 Refresh Token
- 修改密码时，服务器会撤销用户的所有 Refresh Token，强制重新登陆

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误或业务逻辑错误 |
| 401 | 认证失败或未授权 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 422 | 参数验证失败 |
| 500 | 服务器内部错误 |

---

## 安全建议

1. **HTTPS**：生产环境必须使用 HTTPS
2. **Token 存储**：不要在 localStorage 中存储敏感信息，考虑使用 HttpOnly Cookie
3. **CORS**：配置合适的 CORS 策略
4. **速率限制**：对登陆、注册等接口实施速率限制
5. **密码强度**：建议在前端进行密码强度验证
6. **Token 过期**：定期检查 Token 过期时间，及时刷新
