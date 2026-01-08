# 功能开发路线图

本文档管理Personal Portfolio项目的功能开发计划、优先级和时间表。定期更新此文件以反映项目的最新状态。

## 📊 项目概览

**项目状态**：活跃开发中

**当前版本**：1.0.0

**最后更新**：2026年1月8日

**核心功能完成度**：85%

---

## 🎯 优先级说明

| 优先级 | 说明 | 预计时间 |
|-------|------|--------|
| 🔴 P0 - 关键 | 项目必须有的功能，阻塞发布 | 1-2天 |
| 🟠 P1 - 高 | 重要功能，应在下个版本完成 | 2-5天 |
| 🟡 P2 - 中 | 增强功能，改进用户体验 | 5-10天 |
| 🟢 P3 - 低 | 可选功能，未来考虑 | 10+天 |

---

## 📋 已完成功能（V1.0）

### 核心功能
- [x] 首页展示（Hero、About、Projects、Writing、Contact）
- [x] 博客系统（文章列表、详情页、发布状态）
- [x] 项目展示（项目列表、详情页）
- [x] 访客留言系统（提交、查看、回复）
- [x] 权限控制（仅所有者可编辑）
- [x] 密码保护编辑系统

### 管理后台
- [x] 文章管理（创建、编辑、删除、批量操作）
- [x] 项目管理（创建、编辑、删除、批量操作）
- [x] 留言管理（查看、回复、删除）
- [x] 批量删除功能
- [x] 批量发布功能

### UI/UX增强
- [x] 悬浮返回按钮
- [x] 首页最新文章模块
- [x] 响应式设计
- [x] Quiet Narrative设计风格

### 开发工具
- [x] 自动化部署脚本
- [x] 功能需求模板
- [x] Cursor工作流指南
- [x] 部署指南

---

## 🚀 进行中的功能（V1.1）

### 正在开发
- [ ] 文章分类系统（预计3天）
- [ ] 文章搜索功能（预计2天）
- [ ] 阅读统计（预计3天）

### 计划中
- [ ] 评论系统（预计5天）
- [ ] 标签系统（预计2天）
- [ ] 文章推荐算法（预计5天）

---

## 📅 功能开发计划

### 第一阶段：内容管理增强（P1 - 高优先级）

基于网站的定位和当前功能，以下是后续开发的建议。

## 详细功能列表

### 1. 发布第一篇博客文章 🔴 P0
**为什么重要：** 
- 博客系统已完成，但没有内容，显得网站不完整
- 第一篇文章会给访客"这个网站在活跃"的感觉
- 能够展示您的思考深度

**建议内容：**
- "为什么建立这个网站" - 讲述您的初心和理念
- "社区建设的思考" - 分享您对社区的理解
- "从技术到人文" - 讲述您的职业转变

**实现方式：**
- 登录网站后台
- 在博客系统中创建文章（支持 Markdown）
- 发布后自动显示在"一些想法"板块

**预期效果：** 网站从"展示"变成"对话"

---

#### 2. 优化联系我板块的视觉呈现
**当前问题：**
- 邮箱和社交媒体链接存在，但可能不够突出
- 留言表单的成功/失败反馈需要优化

**建议改进：**
- 添加视觉上的"卡片"设计，让联系方式更清晰
- 为邮箱、Instagram、X 添加更好的图标和悬停效果
- 优化留言表单的成功提示（Toast 通知）
- 添加"复制邮箱"快捷功能

**代码示例：**
```typescript
// 改进后的联系方式卡片
const ContactCard = ({ icon, label, value, href }) => (
  <a href={href} className="group">
    <div className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors">
      <Icon className="w-5 h-5" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  </a>
);
```

**预期效果：** 提高访客的联系意愿

---

#### 3. 添加导航栏中的留言管理入口
**当前问题：**
- 登录后没有明显的留言管理入口
- 需要手动输入 URL 才能访问 `/messages`

**建议改进：**
- 登录后在导航栏显示"留言管理"链接
- 显示未读留言数量的红点/徽章
- 添加快捷菜单（用户头像下拉菜单）

**代码示例：**
```typescript
// 导航栏中的用户菜单
{user && (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Avatar>
        <AvatarImage src={user.avatar} />
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem asChild>
        <Link href="/messages">
          留言管理
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={logout}>退出登录</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)}
```

**预期效果：** 提升用户体验，方便管理留言

---

#### 4. 优化移动端响应式设计
**当前问题：**
- 虽然已实现响应式，但可能在某些细节上不够完美
- 移动端的字体大小、间距可能需要微调

**建议改进：**
- 测试各种手机尺寸（iPhone SE、iPhone 14、Android 手机）
- 优化移动端的导航（考虑汉堡菜单）
- 调整移动端的项目卡片布局
- 确保表单在小屏幕上易用

**检查清单：**
- [ ] 首屏在 iPhone SE（375px）上是否清晰
- [ ] 项目卡片在移动端是否堆叠合理
- [ ] 按钮大小是否足够大（最小 44x44px）
- [ ] 表单输入框是否易于点击
- [ ] 导航栏是否在移动端正常显示

**预期效果：** 提升移动端用户体验（占访问量的 60%+）

---

### 🟡 第二阶段：内容丰富（2-4 周）- 中等优先级

这些功能增强网站的深度和专业性。

#### 5. 文章搜索和标签筛选
**为什么重要：**
- 随着文章增多，访客需要快速找到感兴趣的内容
- 标签系统能体现您的思考体系

**建议功能：**
- 在博客列表页添加搜索框
- 按标签筛选（如"社区""文化""技术"）
- 显示标签云

**实现方式：**
```typescript
// 博客列表页的搜索和筛选
const [searchTerm, setSearchTerm] = useState("");
const [selectedTag, setSelectedTag] = useState("");

const filteredArticles = articles.filter(article => 
  (article.title.includes(searchTerm) || 
   article.excerpt.includes(searchTerm)) &&
  (!selectedTag || article.tags.includes(selectedTag))
);
```

**预期效果：** 提升博客的可浏览性

---

#### 6. 项目详情页的"相关项目"推荐
**为什么重要：**
- 增加页面停留时间
- 展示项目之间的关联性

**建议功能：**
- 在项目详情页底部显示 2-3 个相关项目
- 基于标签相似度推荐

**实现方式：**
```typescript
// 获取相关项目
const relatedProjects = projects
  .filter(p => p.id !== currentProject.id)
  .sort((a, b) => {
    const commonTags = a.tags.filter(tag => 
      currentProject.tags.includes(tag)
    ).length;
    return commonTags;
  })
  .slice(0, 3);
```

**预期效果：** 提升用户粘性

---

#### 7. 文章阅读统计
**为什么重要：**
- 了解哪些话题最受欢迎
- 为后续写作提供数据支撑

**建议功能：**
- 记录每篇文章的浏览次数
- 在文章详情页显示阅读数
- 在管理后台显示热门文章排行

**实现方式：**
```typescript
// 数据库表
CREATE TABLE articleViews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  articleId VARCHAR(64),
  viewedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (articleId) REFERENCES articles(id)
);

// API
router.post("articles.recordView", {
  input: z.object({ articleId: z.string() }),
  resolve: async ({ input }) => {
    await db.insert(articleViews).values({
      articleId: input.articleId
    });
  }
});
```

**预期效果：** 数据驱动的内容策略

---

#### 8. 改进项目卡片的视觉设计
**当前问题：**
- 项目卡片可能过于简洁，缺乏视觉吸引力
- 没有充分展示项目的"温度"

**建议改进：**
- 为每个项目添加配图（已有）
- 添加项目的"影响数字"（如"影响 500+ 社区成员"）
- 优化卡片的悬停效果（更明显的阴影、缩放）
- 添加项目的"开始日期"或"进行中"标签

**代码示例：**
```typescript
// 改进的项目卡片
<div className="group cursor-pointer">
  <div className="relative overflow-hidden rounded-lg">
    <img 
      src={project.image} 
      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>
  <div className="mt-4">
    <h3 className="text-xl font-bold">{project.title}</h3>
    <p className="text-sm text-muted-foreground">{project.role}</p>
    <p className="mt-2 text-sm">{project.description}</p>
    
    {/* 新增：影响数字 */}
    <div className="mt-3 flex gap-2">
      <Badge variant="secondary">社区建设</Badge>
      <Badge variant="secondary">500+ 成员</Badge>
    </div>
  </div>
</div>
```

**预期效果：** 提升项目的吸引力

---

### 🟢 第三阶段：专业化（1-3 月）- 低优先级

这些功能提升网站的专业性和长期价值。

#### 9. SEO 优化
**为什么重要：**
- 让更多人通过搜索引擎找到您
- 提升网站的长期价值

**建议改进：**
- 添加 Meta 标签（title、description、keywords）
- 生成 Sitemap
- 添加 robots.txt
- 为每个页面添加 Open Graph 标签（分享时显示预览）
- 结构化数据（Schema.org）

**实现方式：**
```typescript
// 为每个页面添加 Meta 标签
const ArticleHead = ({ article }) => (
  <Helmet>
    <title>{article.title} - Personal Portfolio</title>
    <meta name="description" content={article.excerpt} />
    <meta property="og:title" content={article.title} />
    <meta property="og:description" content={article.excerpt} />
    <meta property="og:image" content={article.image} />
    <meta name="keywords" content={article.tags.join(", ")} />
  </Helmet>
);
```

**预期效果：** 搜索引擎排名提升，更多自然流量

---

#### 10. 性能优化
**为什么重要：**
- 快速的网站提升用户体验
- 搜索引擎倾向于快速网站

**建议改进：**
- 图片优化（WebP 格式、适当压缩、懒加载）
- 代码分割（路由级别的代码分割）
- 缓存策略（浏览器缓存、服务端缓存）
- 数据库查询优化

**检查清单：**
- [ ] Lighthouse 性能评分 > 90
- [ ] 首屏加载时间 < 2s
- [ ] 图片使用 WebP 格式
- [ ] 实现路由级别的代码分割
- [ ] 添加 Service Worker（PWA）

**预期效果：** 更快的加载速度，更好的用户体验

---

#### 11. 暗黑模式
**为什么重要：**
- 满足用户偏好
- 提升网站的现代感

**建议功能：**
- 添加主题切换按钮
- 根据系统偏好自动切换
- 保存用户偏好

**实现方式：**
```typescript
// 在导航栏添加主题切换
const { theme, toggleTheme } = useTheme();

<button onClick={toggleTheme} className="p-2">
  {theme === "dark" ? <Sun /> : <Moon />}
</button>
```

**预期效果：** 提升用户体验和网站现代感

---

#### 12. 评论系统
**为什么重要：**
- 增加读者互动
- 建立社区氛围

**建议功能：**
- 在文章详情页添加评论区
- 支持嵌套评论
- 评论审核（防止垃圾评论）

**实现方式：**
```typescript
// 数据库表
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  articleId VARCHAR(64),
  authorName VARCHAR(255),
  authorEmail VARCHAR(320),
  content TEXT,
  parentCommentId INT,
  approved BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**预期效果：** 增加读者互动，建立社区

---

## 📈 优先级矩阵

```
高影响 + 低工作量 (立即做)
├─ 发布第一篇博客文章
├─ 优化联系我板块视觉
└─ 添加留言管理入口

高影响 + 中工作量 (本月做)
├─ 优化移动端设计
├─ 文章搜索和标签筛选
└─ 改进项目卡片设计

中影响 + 低工作量 (近期做)
├─ 项目详情页推荐
└─ 文章阅读统计

低影响 + 高工作量 (后续做)
├─ SEO 优化
├─ 性能优化
├─ 暗黑模式
└─ 评论系统
```

## 🎯 我的建议

### 立即行动（本周）
1. **发布第一篇博客文章** - 给网站注入生命力
2. **优化联系我板块** - 提升访客联系意愿
3. **测试移动端** - 确保良好的移动体验

### 短期计划（1-2 周）
4. 添加留言管理导航入口
5. 文章搜索和标签筛选
6. 改进项目卡片设计

### 中期计划（1-3 月）
7. SEO 优化
8. 性能优化
9. 暗黑模式

### 长期计划（3-6 月）
10. 评论系统
11. 高级分析
12. 国际化

## 🚀 快速胜利

如果您想快速看到效果，建议按以下顺序：

1. **第 1 天**：发布第一篇博客文章（15 分钟）
2. **第 2-3 天**：优化联系我板块的视觉（1-2 小时）
3. **第 4-5 天**：在手机上测试，修复响应式问题（1-2 小时）
4. **第 6-7 天**：添加留言管理导航入口（30 分钟）

完成这些后，您的网站会显著改善，访客体验也会提升。

---

**最后更新：** 2026-01-07
