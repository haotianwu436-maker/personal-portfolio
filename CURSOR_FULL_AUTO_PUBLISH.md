# Cursor完全自动化发布指南

本文档说明如何让Cursor完全自动化地发布文章，包括自动创建checkpoint和发布到Manus网站。

## 🎯 完全自动化流程

```
你告诉Cursor文章内容
    ↓
Cursor自动执行：
✅ 运行测试
✅ 检查TypeScript
✅ 构建项目
✅ 创建文章
✅ 提交到GitHub
✅ 创建checkpoint
✅ 调用Manus API发布
    ↓
网站自动更新！
```

## 📝 如何使用

### 方式一：完全自动化（推荐）

**告诉Cursor**：

```
我想发布一篇新文章，请完全自动化处理。

【文章信息】
- 标题：为什么建立这个网站
- Slug：why-build-this-website
- 摘要：半梦半醒，永远年轻，永远热泪盈眶。这句话一直是我内心的写照。
- 标签：网站, 初心, 理念

【文章内容】
[你的完整文章内容]

请执行以下步骤：
1. 运行 pnpm test
2. 运行 pnpm check
3. 运行 pnpm build
4. 运行 ./scripts/full-auto-publish.sh "标题" "slug" "摘要" "内容" "标签"
5. 告诉我发布是否成功和网站链接
```

**Cursor会自动**：
- ✅ 运行所有测试
- ✅ 检查类型和构建
- ✅ 创建文章
- ✅ 提交到GitHub
- ✅ 创建checkpoint
- ✅ 发布到网站
- ✅ 告诉你发布结果

---

## 🔧 脚本说明

### full-auto-publish.sh 脚本

这个脚本会自动执行以下步骤：

1. **运行测试** - `pnpm test`
2. **检查TypeScript** - `pnpm check`
3. **构建项目** - `pnpm build`
4. **创建文章** - 保存文章到JSON文件
5. **提交到GitHub** - `git add` 和 `git commit`
6. **创建checkpoint** - 创建版本标记
7. **调用Manus API** - 自动发布到网站（如果配置了API密钥）
8. **生成日志** - 保存详细的执行日志

### 脚本输出

脚本会输出：
- ✅ 每个步骤的执行结果
- 📊 总耗时
- 🔖 版本号
- 🌐 网站链接
- 📋 日志文件位置

---

## 🔐 配置自动发布（可选）

如果你想让Cursor完全自动发布（不需要手动点击Publish按钮），需要配置Manus API密钥。

### 获取API密钥

1. 访问 https://manus.space
2. 打开项目设置
3. 找到"API密钥"部分
4. 复制API密钥

### 配置环境变量

**方式一：在.env文件中配置**

创建或编辑 `.env.local` 文件：

```bash
MANUS_API_KEY=your-api-key-here
MANUS_PROJECT_ID=personal-portfolio
```

**方式二：在脚本中配置**

告诉Cursor：

```
请在scripts/full-auto-publish.sh中配置以下环境变量：
MANUS_API_KEY=your-api-key-here
MANUS_PROJECT_ID=personal-portfolio

然后运行脚本时，Cursor会自动调用Manus API发布网站。
```

**方式三：在发布时指定**

```bash
MANUS_API_KEY=your-api-key MANUS_PROJECT_ID=personal-portfolio ./scripts/full-auto-publish.sh "标题" "slug" "摘要" "内容" "标签"
```

---

## 📋 完整的自动化工作流示例

### 场景：发布新文章

**第1步：准备文章内容**

你在文本编辑器中写好完整的文章。

**第2步：告诉Cursor**

```
我想发布一篇新文章。请完全自动化处理。

【文章信息】
- 标题：为什么建立这个网站
- Slug：why-build-this-website
- 摘要：半梦半醒，永远年轻，永远热泪盈眶。
- 标签：网站, 初心, 理念

【文章内容】
# 为什么建立这个网站

## 初心

半梦半醒，永远年轻，永远热泪盈眶。

...（完整内容）

请运行 ./scripts/full-auto-publish.sh 完全自动化发布。
```

**第3步：Cursor自动执行**

Cursor会：
1. 运行所有测试 ✅
2. 检查TypeScript ✅
3. 构建项目 ✅
4. 创建文章 ✅
5. 提交到GitHub ✅
6. 创建checkpoint ✅
7. 发布到网站 ✅
8. 告诉你结果

**第4步：完成！**

网站自动更新，无需任何手动操作。

---

## 🚀 快速命令参考

### 完全自动化发布

```bash
./scripts/full-auto-publish.sh "标题" "slug" "摘要" "内容" "标签"
```

### 带API密钥的自动发布

```bash
MANUS_API_KEY=your-key ./scripts/full-auto-publish.sh "标题" "slug" "摘要" "内容" "标签"
```

### 查看日志

```bash
tail -f full-publish-*.log
```

---

## ✅ 自动化发布的优势

| 方面 | 优势 |
|------|------|
| **速度** | 从想法到上线只需几分钟 |
| **自动化** | 完全自动，无需人工干预 |
| **质量** | 所有代码都经过测试 |
| **可靠性** | 自动检查，防止错误 |
| **追踪** | 所有更改都在GitHub中记录 |

---

## 🔐 安全检查

自动化发布脚本包含以下安全检查：

1. **测试验证** - 所有测试必须通过
2. **类型检查** - TypeScript必须编译成功
3. **构建验证** - 项目必须构建成功
4. **Git验证** - 代码必须成功提交
5. **API验证** - 发布API调用必须成功

如果任何一个步骤失败，脚本会停止并报告错误。

---

## 📊 发布流程监控

### 查看发布状态

```bash
# 查看最近的发布日志
cat full-publish-YYYYMMDD-HHMMSS.log

# 查看Git提交历史
git log --oneline -10

# 查看网站状态
curl https://persfolio-iet8jqpk.manus.space/
```

### 故障排除

如果发布失败：

1. **查看日志文件** - `full-publish-*.log`
2. **检查错误信息** - 日志会显示具体的错误
3. **检查API密钥** - 确保MANUS_API_KEY正确
4. **检查项目ID** - 确保MANUS_PROJECT_ID正确
5. **重新发布** - 修复问题后再次运行脚本

---

## 💡 最佳实践

### 1. 准备完整的文章内容

不要让Cursor生成文章，而是：
- 你自己写好完整的文章
- 复制到Cursor的提示中
- Cursor负责发布和部署

### 2. 使用清晰的标题和Slug

```
✅ 好的例子：
- 标题：为什么建立这个网站
- Slug：why-build-this-website

❌ 不好的例子：
- 标题：文章1
- Slug：article-1
```

### 3. 添加有意义的标签

```
✅ 好的标签：网站, 初心, 理念, 社区

❌ 不好的标签：文章, 博客, 内容
```

### 4. 定期检查日志

```bash
# 每次发布后检查日志
tail -20 full-publish-*.log
```

---

## 🎯 下一步

1. **告诉Cursor你想发布的文章** - 包含完整内容
2. **Cursor自动执行所有步骤** - 无需人工干预
3. **网站自动更新** - 完全自动化！

---

**现在你有了完全自动化的发布流程！** 🚀
