# Personal Portfolio Website 个人网站

一个极简、有温度、人文气质的个人网站，用于展示理念、项目与社区实践。

## 🎯 核心定位

> 半梦半醒，永远年轻，永远热泪盈眶。
> 做一个有温度、有热情的人。

网站不是"冷冰冰的技术简历"，而是有情绪、有生命感的个人主页。

**气质关键词：** 克制 / 真诚 / 有力量但不张扬 / 人文感 / 年轻但不浮躁

## 📋 功能特性

### 前端功能
- **首页 (Hero Section)**：宣言式标题、关于我、项目展示、博客入口、联系方式
- **项目详情页**：展示项目背景、成就、影响和个人收获
- **博客系统**：文章列表、详情页、Markdown 渲染
- **联系我板块**：邮箱、社交媒体链接、留言表单
- **留言管理后台**：查看、标记已读、回复和删除留言（需认证）

### 后端功能
- **项目管理 API**：获取项目列表和详情
- **博客 API**：发布、编辑、删除文章（需认证）
- **联系表单 API**：提交留言、查看留言、回复留言（需认证）
- **用户认证**：基于 OAuth 的用户认证系统

### 数据库
- **Projects 表**：项目信息（标题、描述、角色、标签、亮点、收获等）
- **Articles 表**：博客文章（标题、内容、状态、标签、发布时间等）
- **ContactSubmissions 表**：访客留言（姓名、邮箱、消息、状态、回复等）
- **Users 表**：用户信息（OAuth 认证）

## 🎨 设计风格

### 颜色方案
- **主色**：黑 / 深灰 / 米白（背景 #F5F1ED，文字 #3C3C3C）
- **强调色**：森林绿 #2D5A4F（象征生长与社区）
- **辅助色**：浅灰 #E8E6E3

### 字体
- **Display Font**：Playfair Display（优雅、编辑感）
- **Body Font**：Inter（现代、可读性强）

### 动效
- 淡入上浮（Fade In + Slide Up）
- Hover 时阴影变化
- 平滑滚动导航

## 🏗️ 项目架构

```
personal-portfolio/
├── client/                    # 前端代码
│   ├── src/
│   │   ├── pages/            # 页面组件
│   │   │   ├── Home.tsx       # 首页
│   │   │   ├── ProjectDetail.tsx  # 项目详情
│   │   │   ├── Blog.tsx       # 博客列表
│   │   │   ├── ArticleDetail.tsx  # 文章详情
│   │   │   ├── Messages.tsx   # 留言管理
│   │   │   └── NotFound.tsx   # 404 页面
│   │   ├── components/        # 可复用组件
│   │   ├── lib/              # 工具函数
│   │   ├── contexts/         # React Context
│   │   ├── App.tsx           # 路由配置
│   │   ├── main.tsx          # 入口
│   │   └── index.css         # 全局样式
│   ├── public/               # 静态资源
│   │   └── images/           # 图片资源
│   └── index.html            # HTML 模板
├── server/                    # 后端代码
│   ├── routers.ts            # API 路由定义
│   ├── db.ts                 # 数据库查询函数
│   ├── index.ts              # 服务器入口
│   ├── *.test.ts             # 单元测试
│   └── _core/                # 核心工具
├── drizzle/                  # 数据库
│   ├── schema.ts             # 数据库模式定义
│   └── migrations/           # 数据库迁移
├── shared/                   # 共享代码
│   └── const.ts              # 常量定义
├── package.json              # 项目依赖
├── tsconfig.json             # TypeScript 配置
└── drizzle.config.ts         # 数据库配置
```

## 🚀 快速开始

### 前置要求
- Node.js 22+
- pnpm 10+
- MySQL 数据库

### 安装依赖
```bash
pnpm install
```

### 环境配置
创建 `.env.local` 文件，配置以下环境变量：
```
# 数据库
DATABASE_URL=mysql://user:password@localhost:3306/personal_portfolio

# OAuth
OAUTH_SERVER_URL=https://api.manus.im
JWT_SECRET=your_jwt_secret

# 其他
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id
```

### 数据库迁移
```bash
pnpm db:push
```

### 启动开发服务器
```bash
pnpm dev
```

访问 http://localhost:3000

### 构建生产版本
```bash
pnpm build
pnpm start
```

### 运行测试
```bash
pnpm test
```

## 📝 API 文档

### Projects API

#### 获取项目列表
```
GET /api/projects/list
```
返回所有项目列表

#### 获取项目详情
```
GET /api/projects/getById?id={projectId}
```
返回指定项目的详细信息

### Articles API

#### 获取已发布文章列表
```
GET /api/articles/list
```
返回所有已发布的文章

#### 按 Slug 获取文章
```
GET /api/articles/getBySlug?slug={slug}
```

#### 创建文章（需认证）
```
POST /api/articles/create
Body: {
  title: string,
  slug: string,
  excerpt: string,
  content: string,
  tags: string[]
}
```

#### 更新文章（需认证）
```
POST /api/articles/update
Body: {
  id: string,
  title?: string,
  excerpt?: string,
  content?: string,
  status?: "draft" | "published",
  tags?: string[]
}
```

#### 删除文章（需认证）
```
POST /api/articles/delete
Body: { id: string }
```

### Contact API

#### 提交留言
```
POST /api/contact/submit
Body: {
  name: string,
  email: string,
  message: string,
  subject?: string
}
```

#### 获取留言列表（需认证）
```
GET /api/contact/list
```

#### 获取留言详情（需认证）
```
GET /api/contact/getById?id={messageId}
```

#### 标记为已读（需认证）
```
POST /api/contact/markAsRead
Body: { id: number }
```

#### 回复留言（需认证）
```
POST /api/contact/reply
Body: {
  id: number,
  reply: string
}
```

#### 删除留言（需认证）
```
POST /api/contact/delete
Body: { id: number }
```

## 🧪 测试

项目包含 28 项单元测试，覆盖所有主要 API 功能：

```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm test --watch
```

测试文件位置：
- `server/projects.test.ts` - 项目 API 测试（11 项）
- `server/articles.test.ts` - 博客 API 测试（8 项）
- `server/contact.test.ts` - 联系 API 测试（8 项）
- `server/auth.logout.test.ts` - 认证测试（1 项）

## 📊 数据库模式

### Projects 表
```sql
CREATE TABLE projects (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  role VARCHAR(255) NOT NULL,
  tags TEXT NOT NULL,
  highlights TEXT NOT NULL,
  learnings TEXT NOT NULL,
  image VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Articles 表
```sql
CREATE TABLE articles (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  authorId INT NOT NULL,
  status ENUM('draft', 'published') DEFAULT 'draft',
  tags TEXT,
  publishedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### ContactSubmissions 表
```sql
CREATE TABLE contactSubmissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL,
  message TEXT NOT NULL,
  subject VARCHAR(255),
  status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
  reply TEXT,
  repliedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 认证

网站使用 OAuth 认证系统。只有认证用户（网站所有者）可以：
- 创建、编辑、删除博客文章
- 查看、回复和删除访客留言

### 登录流程
1. 用户点击登录按钮
2. 重定向到 OAuth 服务器
3. 登录后返回网站，设置 JWT Cookie
4. 前端可访问受保护的 API

## 🎯 后续开发建议

### 短期（1-2 周）
- [ ] 发布第一篇博客文章
- [ ] 在导航栏添加留言管理入口（登录后显示）
- [ ] 优化移动端响应式设计

### 中期（1-2 月）
- [ ] 添加文章搜索和标签筛选功能
- [ ] 实现文章阅读统计
- [ ] 添加评论系统
- [ ] SEO 优化（Meta 标签、Sitemap）

### 长期（3-6 月）
- [ ] 绑定自定义域名
- [ ] 添加暗黑模式
- [ ] 实现国际化（i18n）
- [ ] 性能优化（CDN、缓存策略）

## 📦 技术栈

### 前端
- **框架**：React 19
- **路由**：Wouter
- **样式**：Tailwind CSS 4
- **组件库**：shadcn/ui
- **动画**：Framer Motion
- **HTTP 客户端**：Axios + tRPC

### 后端
- **框架**：Express.js
- **API**：tRPC
- **数据库**：MySQL + Drizzle ORM
- **认证**：OAuth + JWT

### 开发工具
- **构建**：Vite
- **类型检查**：TypeScript
- **测试**：Vitest
- **代码格式**：Prettier

## 📄 许可证

MIT

## 👤 作者

Haotian Wu (吴浩天)
- Email: haotianwu436@gmail.com
- Instagram: @dlxbxy
- X (Twitter): @dlxbxy

---

**Built slowly, with care.**
