# 开发指南

本文档为 Cursor 和其他开发者提供详细的开发指南。

## 🏁 项目初始化

### 1. 克隆仓库
```bash
git clone https://github.com/haotianwu436-maker/personal-portfolio.git
cd personal-portfolio
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 环境配置

创建 `.env.local` 文件：
```env
# 数据库连接
DATABASE_URL=mysql://user:password@localhost:3306/personal_portfolio

# OAuth 配置
OAUTH_SERVER_URL=https://api.manus.im
JWT_SECRET=your_jwt_secret_here

# 网站所有者信息
OWNER_NAME=Haotian Wu
OWNER_OPEN_ID=your_open_id

# 前端配置
VITE_APP_TITLE=Personal Portfolio
VITE_APP_LOGO=/logo.png
```

### 4. 数据库设置

```bash
# 执行迁移
pnpm db:push

# 查看数据库状态
pnpm db:studio
```

### 5. 启动开发服务器
```bash
pnpm dev
```

访问 http://localhost:3000

## 📁 文件结构详解

### 前端结构 (`client/src/`)

#### Pages 页面组件
- **Home.tsx** - 首页，包含 Hero、About、Projects、Writing、Contact 五个板块
  - `Hero` 组件：宣言式标题和 CTA 按钮
  - `AboutMe` 组件：个人介绍
  - `ProjectsList` 组件：项目卡片列表
  - `ProjectCard` 组件：单个项目卡片
  - `ContactForm` 组件：留言表单
  
- **ProjectDetail.tsx** - 项目详情页
  - 显示项目完整信息（背景、成就、影响、收获）
  - 返回按钮导航
  - 相关项目推荐（可选）

- **Blog.tsx** - 博客列表页
  - 文章列表展示
  - 按发布时间排序
  - 搜索和标签筛选（可选）

- **ArticleDetail.tsx** - 文章详情页
  - Markdown 渲染
  - 文章元数据（作者、发布时间、标签）
  - 相关文章推荐（可选）

- **Messages.tsx** - 留言管理页（需认证）
  - 留言列表（左侧）
  - 留言详情和回复表单（右侧）
  - 标记已读、回复、删除功能

- **NotFound.tsx** - 404 页面

#### Components 可复用组件
- `ui/` - shadcn/ui 组件库
- `ErrorBoundary.tsx` - 错误边界
- `Map.tsx` - Google Maps 集成（如需使用）

#### Contexts 上下文
- `ThemeContext.tsx` - 主题切换（暗黑/亮色模式）

#### Lib 工具函数
- `trpc.ts` - tRPC 客户端配置
- 其他工具函数

#### 样式
- `index.css` - 全局样式和设计令牌
  - CSS 变量定义
  - Tailwind 配置
  - 自定义组件类

### 后端结构 (`server/`)

#### 核心文件
- **routers.ts** - API 路由定义
  - `system` 路由：系统信息
  - `auth` 路由：认证相关
  - `projects` 路由：项目 API
  - `contact` 路由：联系表单 API
  - `articles` 路由：博客 API

- **db.ts** - 数据库查询函数
  - 项目查询：`getAllProjects()`, `getProjectById()`
  - 文章查询：`getAllPublishedArticles()`, `getArticleBySlug()` 等
  - 联系查询：`createContactSubmission()`, `getAllContactSubmissions()` 等

- **index.ts** - Express 服务器入口
  - 静态文件服务
  - 客户端路由处理

#### 测试文件
- **projects.test.ts** - 项目 API 测试
- **articles.test.ts** - 博客 API 测试
- **contact.test.ts** - 联系 API 测试
- **auth.logout.test.ts** - 认证测试

#### 核心工具 (`_core/`)
- `context.ts` - tRPC 上下文
- `trpc.ts` - tRPC 配置
- `cookies.ts` - Cookie 管理
- `systemRouter.ts` - 系统路由

### 数据库结构 (`drizzle/`)

- **schema.ts** - 数据库模式定义
  - `users` 表：用户信息
  - `projects` 表：项目信息
  - `articles` 表：博客文章
  - `contactSubmissions` 表：访客留言

- **migrations/** - 数据库迁移文件
  - 记录所有数据库变更历史

## 🛠️ 常见开发任务

### 添加新的项目

1. **在数据库中添加项目**
   ```typescript
   // 使用 db:studio 或直接插入 SQL
   INSERT INTO projects (id, title, description, role, tags, highlights, learnings, image)
   VALUES ('project-id', '项目名称', '描述', '角色', '["标签1","标签2"]', '["亮点1","亮点2"]', '["收获1","收获2"]', '/images/project.jpg');
   ```

2. **验证项目显示**
   - 首页项目列表应自动更新
   - 点击"了解更多"进入详情页

### 发布新文章

1. **登录网站**
   - 点击登录按钮，通过 OAuth 认证

2. **创建文章**
   ```bash
   # 使用 API 创建文章
   curl -X POST http://localhost:3000/api/articles/create \
     -H "Content-Type: application/json" \
     -d '{
       "title": "文章标题",
       "slug": "article-slug",
       "excerpt": "摘要",
       "content": "# Markdown 内容",
       "tags": ["标签1", "标签2"]
     }'
   ```

3. **发布文章**
   - 在管理后台更新文章状态为 "published"

### 处理访客留言

1. **访问留言管理页面**
   - 登录后访问 `/messages`

2. **查看留言**
   - 左侧列表显示所有留言
   - 点击留言查看详情

3. **回复留言**
   - 在详情页填写回复内容
   - 点击"发送回复"或"通过邮件回复"

### 修改设计风格

#### 颜色主题
编辑 `client/src/index.css` 中的 CSS 变量：
```css
:root {
  --primary: oklch(0.623 0.214 259.815); /* 主色 */
  --background: oklch(1 0 0); /* 背景色 */
  --foreground: oklch(0.235 0.015 65); /* 文字色 */
  /* 其他颜色变量 */
}
```

#### 字体
编辑 `client/index.html` 中的 Google Fonts 链接：
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

#### 动效
修改 `client/src/pages/Home.tsx` 中的 Framer Motion 配置：
```typescript
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};
```

## 🧪 测试指南

### 运行测试
```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test server/projects.test.ts

# 监听模式
pnpm test --watch

# 生成覆盖率报告
pnpm test --coverage
```

### 编写新测试

示例：测试新的 API 端点
```typescript
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("new feature", () => {
  it("should do something", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.newRouter.newProcedure({ /* input */ });
    
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });
});
```

## 📱 响应式设计

项目采用移动端优先的设计方法：

```typescript
// 示例：Tailwind 响应式类
<div className="text-sm md:text-base lg:text-lg">
  {/* 移动端：小字体 */}
  {/* 平板：中等字体 */}
  {/* 桌面：大字体 */}
</div>
```

断点：
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🔒 安全性

### 认证保护
所有需要认证的 API 都在 `routers.ts` 中检查 `ctx.user`：
```typescript
if (!ctx.user) {
  throw new Error("Unauthorized");
}
```

### 输入验证
使用 Zod 验证所有 API 输入：
```typescript
.input(z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
}))
```

### 环境变量
敏感信息存储在 `.env.local` 中，不提交到版本控制。

## 🚀 部署

### 构建生产版本
```bash
pnpm build
```

### 启动生产服务器
```bash
pnpm start
```

### 环境变量检查
确保生产环境配置了所有必需的环境变量。

## 📚 相关资源

- [React 官方文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [Drizzle ORM 文档](https://orm.drizzle.team)
- [tRPC 文档](https://trpc.io)
- [Framer Motion 文档](https://www.framer.com/motion)

## 🤝 贡献指南

1. 创建功能分支：`git checkout -b feature/your-feature`
2. 提交更改：`git commit -am 'Add new feature'`
3. 推送分支：`git push origin feature/your-feature`
4. 创建 Pull Request

## ❓ 常见问题

### Q: 如何添加新的页面？
A: 
1. 在 `client/src/pages/` 创建新组件
2. 在 `client/src/App.tsx` 添加路由
3. 在导航中添加链接（如需要）

### Q: 如何修改数据库模式？
A:
1. 编辑 `drizzle/schema.ts`
2. 运行 `pnpm db:push` 执行迁移
3. 更新相关的数据库查询函数

### Q: 如何调试 API？
A:
1. 使用浏览器开发者工具的 Network 标签
2. 查看服务器日志（`pnpm dev` 输出）
3. 使用 tRPC 开发工具

### Q: 如何处理 CORS 错误？
A:
- 前端请求自动通过 tRPC 代理，无需手动配置 CORS
- 如需直接 HTTP 请求，检查服务器 CORS 配置

---

有任何问题，请查阅相关技术文档或创建 Issue。
