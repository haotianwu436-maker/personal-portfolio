# 自动化设置快速指南

本文档说明如何使用Cursor和自动化脚本来高效地改进和部署项目。

## 📋 概览

你现在拥有完整的自动化设置：

| 组件 | 说明 |
|------|------|
| **CURSOR_WORKFLOW.md** | Cursor工作流指南 - 告诉Cursor如何改进项目 |
| **DEPLOYMENT_GUIDE.md** | 部署指南 - 详细的部署流程说明 |
| **scripts/deploy.sh** | 本地部署脚本 - 自动运行测试和部署检查 |
| **GitHub仓库** | 代码版本控制和协作 |
| **Manus平台** | 自动部署和托管 |

## 🚀 快速开始

### 第1步：使用Cursor改进项目

1. **打开项目**：在Cursor中打开 `/home/ubuntu/personal-portfolio`

2. **参考工作流**：阅读 `CURSOR_WORKFLOW.md` 了解如何改进项目

3. **修改代码**：
   - 按照工作流指南进行修改
   - 每个功能都有详细的步骤说明

### 第2步：本地验证

```bash
# 在项目目录运行部署脚本
./scripts/deploy.sh

# 脚本会自动：
# 1. 运行所有单元测试
# 2. 检查TypeScript类型
# 3. 构建项目
# 4. 提交到GitHub
```

### 第3步：在Manus UI中发布

1. 访问 https://manus.space
2. 进入 personal-portfolio 项目
3. 点击 **Publish** 按钮
4. 等待部署完成

## 📚 详细文档

### 给Cursor的指南

**文件**: `CURSOR_WORKFLOW.md`

这份文档包含：
- 项目结构说明
- 添加新功能的完整步骤
- 权限控制规则
- 测试要求
- 代码规范
- 常见任务清单

**使用方法**：
```
在Cursor中打开CURSOR_WORKFLOW.md，按照指南进行开发
```

### 部署流程详解

**文件**: `DEPLOYMENT_GUIDE.md`

这份文档包含：
- 完整的工作流程图
- 分步骤的部署说明
- 常见问题解答
- 故障排除指南
- 监控和维护建议

**使用方法**：
```
遇到部署问题时查阅此文档
```

### 本地部署脚本

**文件**: `scripts/deploy.sh`

这个脚本自动化了以下步骤：
1. 检查依赖（pnpm）
2. 运行单元测试（28项）
3. 检查TypeScript类型
4. 构建项目
5. 提交到GitHub

**使用方法**：
```bash
./scripts/deploy.sh
```

## 🔄 典型工作流

### 场景1：添加新功能

```
1. 在Cursor中打开项目
   ↓
2. 阅读 CURSOR_WORKFLOW.md 了解步骤
   ↓
3. 修改代码（数据库 → 后端 → 前端）
   ↓
4. 编写单元测试
   ↓
5. 运行 ./scripts/deploy.sh
   ↓
6. 在Manus UI中点击Publish
   ↓
7. 验证网站更新
```

### 场景2：修复Bug

```
1. 在Cursor中定位问题
   ↓
2. 修改相关代码
   ↓
3. 运行 pnpm test 验证修复
   ↓
4. 运行 ./scripts/deploy.sh
   ↓
5. 在Manus UI中发布
```

### 场景3：更新文档

```
1. 编辑Markdown文档
   ↓
2. 运行 ./scripts/deploy.sh
   ↓
3. 在Manus UI中发布
```

## 🎯 最佳实践

### 1. 使用Cursor的优势

✅ **自然语言编程**：用中文描述你想要的功能，Cursor会帮你实现

✅ **代码理解**：Cursor能理解整个项目的上下文

✅ **快速迭代**：实时反馈和修改建议

✅ **测试驱动**：Cursor会自动编写测试

### 2. 部署前检查清单

- [ ] 所有测试通过（`pnpm test`）
- [ ] TypeScript无错误（`pnpm check`）
- [ ] 代码构建成功（`pnpm build`）
- [ ] 更新了 `todo.md`
- [ ] 提交message清晰
- [ ] 在Manus UI中发布

### 3. 定期维护

| 任务 | 频率 |
|------|------|
| 运行测试 | 每次修改后 |
| 提交代码 | 每个功能完成后 |
| 发布部署 | 测试通过后 |
| 检查日志 | 每周 |
| 更新依赖 | 每月 |

## 🔧 常用命令

```bash
# 开发
pnpm dev                    # 启动开发服务器
pnpm test                   # 运行所有测试
pnpm check                  # 检查TypeScript
pnpm build                  # 构建项目
pnpm format                 # 格式化代码

# 数据库
pnpm db:push               # 推送数据库变更

# 部署
./scripts/deploy.sh        # 完整部署流程

# Git
git add .                  # 添加所有更改
git commit -m "message"    # 提交
git push github main       # 推送到GitHub
```

## 📊 工作流图

```
┌─────────────────────────────────────────────────────────────┐
│ Cursor 开发环境                                              │
│ - 修改代码                                                   │
│ - 实时预览                                                   │
│ - 自动测试                                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 本地验证 (scripts/deploy.sh)                                │
│ - 运行单元测试                                               │
│ - 检查TypeScript                                            │
│ - 构建项目                                                   │
│ - 提交到GitHub                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ GitHub 代码库                                                │
│ - 版本控制                                                   │
│ - 代码审查                                                   │
│ - 协作开发                                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Manus 平台                                                   │
│ - 点击 Publish 按钮                                          │
│ - 自动部署                                                   │
│ - 实时更新                                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 生产网站                                                     │
│ https://persfolio-iet8jqpk.manus.space/                     │
└─────────────────────────────────────────────────────────────┘
```

## ❓ 常见问题

### Q: 如何让Cursor继续改进项目？

**A**: 
1. 在Cursor中打开项目文件夹
2. 阅读 `CURSOR_WORKFLOW.md`
3. 用自然语言描述你想要的功能
4. Cursor会按照工作流指南进行开发

### Q: 部署脚本失败了怎么办？

**A**:
1. 查看错误信息
2. 修复问题（通常是测试失败）
3. 重新运行 `./scripts/deploy.sh`

### Q: 如何跳过某个步骤？

**A**: 不建议跳过。但如果必须，可以：
- 跳过测试：`pnpm build`
- 跳过构建：直接 `git push`
- 但这样会增加风险

### Q: 网站部署后没有更新怎么办？

**A**:
1. 清除浏览器缓存
2. 等待2-3分钟让CDN更新
3. 检查Manus Management UI中的部署日志

## 🎓 学习资源

- **Cursor文档**：https://cursor.sh/docs
- **React文档**：https://react.dev
- **TypeScript文档**：https://www.typescriptlang.org
- **Tailwind CSS**：https://tailwindcss.com
- **tRPC文档**：https://trpc.io

## 🚨 故障排除

### 问题：测试失败

```bash
# 1. 查看具体错误
pnpm test

# 2. 修复代码
# 编辑相关文件

# 3. 重新运行测试
pnpm test
```

### 问题：构建失败

```bash
# 1. 检查TypeScript错误
pnpm check

# 2. 修复类型错误
# 编辑相关文件

# 3. 重新构建
pnpm build
```

### 问题：推送到GitHub失败

```bash
# 1. 检查网络连接
# 2. 检查GitHub凭证
# 3. 尝试重新推送
git push github main
```

## 📞 获取帮助

- **开发问题**：查看 `CURSOR_WORKFLOW.md`
- **部署问题**：查看 `DEPLOYMENT_GUIDE.md`
- **脚本问题**：查看 `scripts/deploy.sh` 的注释
- **一般问题**：查看 `MAINTENANCE.md` 和 `DEVELOPMENT.md`

---

**记住**：这个自动化设置的目标是让你能够快速、安全地改进项目。充分利用这些工具和文档，你可以高效地迭代和部署！

**下一步**：
1. 在Cursor中打开项目
2. 阅读 `CURSOR_WORKFLOW.md`
3. 开始改进项目
4. 使用 `./scripts/deploy.sh` 验证
5. 在Manus UI中发布
