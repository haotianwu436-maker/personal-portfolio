# 网站维护与更新指南

这份指南将帮助您长期维护和更新您的个人网站。

## 1. 如何后续加入博客

目前网站的“Writing / Thoughts”板块是一个占位符。如果您想加入真正的博客功能，建议按以下步骤操作：

1.  **创建文章数据文件**: 在 `client/src` 下创建一个 `data` 文件夹，并新建 `posts.ts`，用于存储文章列表（标题、日期、摘要、链接）。
2.  **创建文章详情页**: 在 `client/src/pages` 下新建 `Post.tsx`，用于渲染单篇文章。
3.  **配置路由**: 在 `client/src/App.tsx` 中添加新的路由规则，例如 `<Route path="/blog/:slug" component={Post} />`。
4.  **使用 Markdown 渲染**: 推荐使用 `react-markdown` 或项目已预装的 `streamdown` 组件来渲染文章内容，这样您可以直接编写 Markdown 文件。

## 2. 如何新增项目详情页

目前的“项目”板块是卡片式展示。如果您需要为每个项目添加详细介绍页面：

1.  **新建页面组件**: 在 `client/src/pages` 下新建 `ProjectDetail.tsx`。
2.  **配置路由**: 在 `client/src/App.tsx` 中添加路由，例如 `<Route path="/projects/:id" component={ProjectDetail} />`。
3.  **更新卡片链接**: 修改 `Home.tsx` 中的 `ProjectCard` 组件，将“了解更多”按钮的点击事件改为跳转到对应的详情页路由。

## 3. 如何换主题色

网站采用了 CSS 变量管理颜色，修改非常简单：

1.  打开 `client/src/index.css` 文件。
2.  找到 `:root` 代码块。
3.  修改对应的颜色变量值（支持 OKLCH 颜色格式，也支持 HEX/RGB）：
    *   `--background`: 页面背景色
    *   `--foreground`: 正文文字颜色
    *   `--primary`: 主题色（按钮、强调文字）
    *   `--primary-foreground`: 主题色上的文字颜色（如按钮文字）

**示例：将主题色改为深蓝**
```css
:root {
  /* ...其他变量 */
  --primary: oklch(0.4 0.1 250); /* 深蓝色 */
  /* ... */
}
```

## 4. 如何绑定自定义域名

1.  在 Manus 管理界面的“Settings” -> “Domains” 面板中操作。
2.  您可以直接购买新域名，或者绑定您已有的域名。
3.  按照界面提示配置 DNS 解析记录（通常是 CNAME 或 A 记录）。
4.  绑定成功后，系统会自动为您配置 SSL 证书，实现 HTTPS 访问。

---

**Built slowly, with care.**
