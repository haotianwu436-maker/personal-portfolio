# Cursor工作流指南

这份文档指导Cursor如何高效地改进和维护个人作品集网站。

## 项目概述

**项目名称**：Personal Portfolio（个人作品集网站）

**技术栈**：React 19 + TypeScript + Vite + Tailwind CSS 4 + Express.js + MySQL + Drizzle ORM

**设计理念**："Quiet Narrative"极简美学 - 温暖的米色背景、深灰色文字、森林绿强调色、编辑排版风格

**核心功能**：
- 个人品牌展示（Hero、About、Projects、Writing、Contact）
- 完整的博客系统（文章列表、详情、编辑、发布）
- 项目展示与详情页面
- 访客留言管理系统
- 权限控制（仅所有者可编辑）
- 最新文章模块（首页展示3篇）

## 开发工作流

### 1. 理解项目结构

```
personal-portfolio/
├── client/                 # React前端应用
│   ├── src/
│   │   ├── pages/         # 页面组件（Home、ArticleDetail等）
│   │   ├── components/    # 可复用UI组件
│   │   ├── lib/           # tRPC客户端配置
│   │   ├── _core/         # 认证hooks
│   │   └── index.css      # 全局样式和设计令牌
│   └── public/            # 静态资源
├── server/                # Express后端服务
│   ├── routers.ts         # tRPC路由和API端点
│   ├── db.ts              # 数据库查询函数
│   ├── storage.ts         # S3文件存储
│   └── _core/             # 认证、OAuth、LLM集成
├── drizzle/               # 数据库schema和迁移
│   ├── schema.ts          # 表定义
│   └── migrations/        # 迁移文件
├── shared/                # 前后端共享代码
├── server/*.test.ts       # 单元测试文件
└── todo.md                # 任务清单
```

### 2. 添加新功能的步骤

**步骤1：更新TODO清单**
```bash
# 在todo.md中添加新功能项
- [ ] 新功能描述
```

**步骤2：数据库变更（如需要）**
```bash
# 编辑drizzle/schema.ts添加新表或字段
# 然后运行迁移
pnpm db:push
```

**步骤3：后端实现**
```bash
# 在server/db.ts添加数据库查询函数
# 在server/routers.ts添加tRPC路由

# 示例：添加新的查询路由
feature: router({
  getAll: publicProcedure.query(async () => {
    return await getAllFeatures();
  }),
  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user || ctx.user.openId !== ENV.ownerOpenId) {
        throw new Error("Unauthorized");
      }
      // 实现逻辑
    }),
})
```

**步骤4：编写单元测试**
```bash
# 在server/[feature].test.ts中编写测试
# 必须测试：
# - 公开端点（无认证）
# - 受保护端点（需要所有者认证）
# - 错误处理
# - 数据验证

# 运行测试
pnpm test
```

**步骤5：前端实现**
```bash
# 在client/src/pages/或components/中创建UI组件
# 使用tRPC hooks调用后端API

import { trpc } from "@/lib/trpc";

export function MyFeature() {
  const { data, isLoading } = trpc.feature.getAll.useQuery();
  const createMutation = trpc.feature.create.useMutation();
  
  return (
    // 实现UI
  );
}
```

**步骤6：更新TODO并提交**
```bash
# 更新todo.md中的任务状态
- [x] 新功能描述

# 提交到Git
git add .
git commit -m "feat: 添加新功能描述"
git push origin main
```

### 3. 权限控制规则

**重要**：所有修改内容的操作都必须检查权限。

```typescript
// 后端权限检查模式
if (!ctx.user || ctx.user.openId !== ENV.ownerOpenId) {
  throw new Error("Unauthorized: Only the owner can perform this action");
}
```

**前端权限检查**：
```typescript
// 使用useAuth()获取当前用户
const { user } = useAuth();

// 仅在所有者登录时显示编辑按钮
{user?.openId === ENV.ownerOpenId && (
  <button onClick={handleEdit}>编辑</button>
)}
```

### 4. 测试要求

**必须运行所有测试**：
```bash
pnpm test
```

**测试必须全部通过**才能提交代码。常见测试场景：

| 场景 | 测试方法 |
|------|--------|
| 公开数据访问 | 使用`createPublicContext()`测试无认证访问 |
| 所有者操作 | 使用`createAuthContext()`测试已认证访问 |
| 未授权操作 | 验证非所有者用户被拒绝 |
| 数据验证 | 测试无效输入被正确拒绝 |
| 数据完整性 | 验证创建/更新/删除后的数据状态 |

### 5. 代码规范

**TypeScript**：
- 始终为函数参数和返回值添加类型注解
- 使用`z.object()`进行tRPC输入验证
- 避免使用`any`类型

**React组件**：
- 使用函数式组件和hooks
- 优先使用shadcn/ui组件库
- 使用Tailwind CSS进行样式（不要写原始CSS）
- 添加loading和error状态处理

**样式**：
- 遵循"Quiet Narrative"设计系统
- 使用设计令牌（在index.css中定义）：
  - 背景色：`bg-background`
  - 文字色：`text-foreground`
  - 强调色：`bg-primary`
  - 间距：使用Tailwind的标准间距（p-4, m-8等）

### 6. 常见任务清单

**添加新的博客文章字段**：
1. 编辑`drizzle/schema.ts`中的articles表
2. 运行`pnpm db:push`
3. 在`server/db.ts`中更新查询函数
4. 在`server/routers.ts`中更新create/update路由
5. 编写测试验证新字段
6. 更新前端编辑表单

**添加新的联系方式**：
1. 编辑`client/src/pages/Home.tsx`中的Contact部分
2. 添加新的社交媒体链接或联系方式
3. 更新`MAINTENANCE.md`中的配置说明

**改进UI/UX**：
1. 编辑相应的React组件
2. 使用Tailwind CSS调整样式
3. 在浏览器中预览（开发服务器自动热重载）
4. 提交代码

### 7. 调试技巧

**开发服务器**：
```bash
pnpm dev
# 访问 http://localhost:3000
# 前端和后端都会自动热重载
```

**查看数据库**：
- 在Manus Management UI中的Database面板查看表数据
- 或使用`webdev_execute_sql`执行SQL查询

**查看日志**：
- 后端日志在开发服务器输出中显示
- 前端错误在浏览器控制台显示

### 8. 部署流程

**本地测试完成后**：
```bash
# 1. 确保所有测试通过
pnpm test

# 2. 提交代码到GitHub
git add .
git commit -m "feat: 描述你的改动"
git push origin main

# 3. GitHub Actions会自动：
#    - 运行所有测试
#    - 构建项目
#    - 如果成功，自动创建checkpoint

# 4. 在Manus Management UI中点击Publish按钮发布
```

## 关键文件参考

| 文件 | 用途 |
|------|------|
| `client/src/pages/Home.tsx` | 主页面（Hero、About、Projects、Writing、Contact） |
| `client/src/pages/ArticleDetail.tsx` | 文章详情页 |
| `client/src/pages/ArticleEdit.tsx` | 文章编辑页 |
| `server/routers.ts` | 所有API端点定义 |
| `server/db.ts` | 数据库查询函数 |
| `drizzle/schema.ts` | 数据库表定义 |
| `client/src/index.css` | 全局样式和设计令牌 |
| `todo.md` | 项目任务清单 |

## 环境变量

这些变量由Manus平台自动注入，无需手动配置：

- `DATABASE_URL` - MySQL连接字符串
- `OWNER_OPEN_ID` - 网站所有者的OAuth ID
- `OWNER_NAME` - 网站所有者名称
- `JWT_SECRET` - 会话加密密钥
- `VITE_APP_ID` - OAuth应用ID
- `OAUTH_SERVER_URL` - OAuth服务器地址
- `VITE_OAUTH_PORTAL_URL` - OAuth登录门户

## 快速参考

**运行开发服务器**：
```bash
pnpm dev
```

**运行所有测试**：
```bash
pnpm test
```

**推送数据库变更**：
```bash
pnpm db:push
```

**格式化代码**：
```bash
pnpm format
```

**检查TypeScript**：
```bash
pnpm check
```

## 需要帮助？

- 查看`MAINTENANCE.md`了解维护指南
- 查看`DEVELOPMENT.md`了解开发文档
- 查看`README.md`了解项目概述
- 查看现有的测试文件（`server/*.test.ts`）了解测试模式

---

**最后提醒**：
- ✅ 每次修改后必须运行`pnpm test`
- ✅ 所有权限检查都要验证
- ✅ 提交前更新`todo.md`
- ✅ 使用清晰的commit message
- ✅ 遵循现有的代码风格和设计系统
