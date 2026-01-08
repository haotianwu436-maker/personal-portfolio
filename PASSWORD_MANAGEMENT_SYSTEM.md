# 密码管理系统需求文档

## 🎯 目标

创建一个密码管理系统，使用户可以在网站管理后台直接修改编辑密码，而不需要修改代码。

## 📋 需求说明

### 当前问题

- 编辑密码硬编码在代码中（`client/src/_core/hooks/useEditPassword.ts`）
- 修改密码需要改代码并重新部署
- 用户无法在网站上直接管理密码

### 解决方案

实现一个密码管理系统，包括：

1. **数据库表** - 存储编辑密码
2. **API端点** - 获取和更新密码
3. **管理UI** - 在后台修改密码
4. **密码验证** - 从数据库读取密码进行验证

## 🗄️ 数据库设计

### settings 表

```sql
CREATE TABLE settings (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 初始数据

```sql
INSERT INTO settings (id, key, value, description) VALUES
('edit-password', 'EDIT_PASSWORD', 'dlxbxy', '文章编辑密码');
```

## 🔌 API端点

### 获取密码（仅所有者）

```
GET /api/settings/edit-password
Response: { value: "dlxbxy" }
```

### 更新密码（仅所有者）

```
POST /api/settings/edit-password
Body: { value: "新密码" }
Response: { success: true, message: "密码已更新" }
```

## 🎨 UI设计

### 管理后台 - 密码设置页面

位置：`/admin/settings` 或 `/admin/password`

功能：
- 显示当前密码（隐藏）
- 输入框修改密码
- 确认按钮保存
- 成功/失败提示

## 📝 实现清单

### 后端

- [ ] 创建 `settings` 数据库表
- [ ] 创建 `getEditPassword` API端点
- [ ] 创建 `updateEditPassword` API端点
- [ ] 添加权限检查（仅所有者）
- [ ] 编写API测试

### 前端

- [ ] 修改 `useEditPassword` hook，从API读取密码
- [ ] 创建密码管理页面（`PasswordSettings.tsx`）
- [ ] 在管理后台导航中添加"密码设置"链接
- [ ] 添加密码修改表单和验证
- [ ] 添加成功/失败提示

### 测试

- [ ] 测试获取密码API
- [ ] 测试更新密码API
- [ ] 测试权限检查
- [ ] 测试前端密码修改流程

## 🔐 安全考虑

1. **权限检查** - 仅所有者可以修改密码
2. **密码存储** - 密码存储在数据库中（可选：加密存储）
3. **API验证** - 所有API调用都需要验证
4. **日志记录** - 记录密码修改历史

## 📊 用户流程

```
用户访问管理后台
    ↓
点击"密码设置"
    ↓
输入新密码
    ↓
点击"保存"
    ↓
API更新数据库
    ↓
显示成功提示
    ↓
下次编辑文章时使用新密码
```

## 🚀 实现优先级

1. **P0 - 必须** - 创建settings表和API端点
2. **P1 - 高** - 创建密码管理UI页面
3. **P2 - 中** - 添加密码修改历史记录
4. **P3 - 低** - 添加密码强度检查

## 📚 相关文件

- `client/src/_core/hooks/useEditPassword.ts` - 当前密码验证逻辑
- `server/routers.ts` - API端点
- `client/src/pages/ArticleEdit.tsx` - 使用密码验证的页面

## 💡 实现建议

### 方式一：简单实现（推荐）

1. 创建settings表，存储密码
2. 创建API端点获取/更新密码
3. 修改useEditPassword hook，从API读取密码
4. 创建简单的密码修改表单

### 方式二：完整实现

1. 在方式一的基础上
2. 添加密码修改历史记录
3. 添加密码强度检查
4. 添加修改日志和审计

## ✅ 验收标准

- [ ] 用户可以在管理后台修改密码
- [ ] 新密码立即生效
- [ ] 只有所有者可以修改密码
- [ ] 所有API都有权限检查
- [ ] 所有测试通过
- [ ] 无代码硬编码的密码

---

## 🎯 告诉Cursor的方式

```
我想实现一个密码管理系统，这样我可以在网站管理后台直接修改编辑密码。

需求：
1. 创建settings数据库表，存储编辑密码
2. 创建API端点：GET /api/settings/edit-password 和 POST /api/settings/edit-password
3. 修改useEditPassword hook，从API读取密码而不是硬编码
4. 创建密码管理页面（/admin/password），允许修改密码
5. 添加权限检查，仅所有者可以修改密码
6. 编写测试确保功能正常

请按照PASSWORD_MANAGEMENT_SYSTEM.md中的需求实现。
```

---

**现在你可以在网站上直接管理密码了！** 🔐
