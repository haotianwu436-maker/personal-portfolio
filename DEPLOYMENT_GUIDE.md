# 部署指南

本文档说明如何使用自动化流程部署个人作品集网站。

## 自动化部署流程

项目已配置了完整的自动化部署流程，包括自动测试、构建和失败回滚。

### 工作流程图

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 本地开发 (Cursor 或本地编辑)                              │
│    - 修改代码                                               │
│    - 运行 pnpm test 验证                                    │
│    - 提交到 Git                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. 运行部署脚本 (./scripts/deploy.sh)                       │
│    - 创建备份                                               │
│    - 运行所有测试                                           │
│    - 检查TypeScript                                         │
│    - 构建项目                                               │
│    - 提交到GitHub                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  所有步骤通过?        │
        └──────────┬───────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
       YES                    NO
        │                     │
        ▼                     ▼
    ✅ 成功              ❌ 自动回滚
    准备发布             恢复备份
        │                 生成日志
        │                     │
        └─────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. 手动发布 (Manus UI)                                      │
│    - 访问 Manus Management UI                               │
│    - 点击 Publish 按钮                                      │
│    - 网站自动更新                                           │
└─────────────────────────────────────────────────────────────┘
```

## 快速开始

### 使用部署脚本（推荐）

最简单的方式是使用自动化部署脚本 `scripts/deploy.sh`，它会自动运行所有检查、测试、构建和提交，并在失败时自动回滚：

```bash
# 在项目根目录运行
./scripts/deploy.sh
```

脚本会自动执行以下步骤：

1. 创建备份（用于回滚）
2. 运行所有单元测试（28项）
3. 检查TypeScript类型
4. 构建项目
5. 提交到GitHub
6. 如果任何步骤失败，自动回滚到之前的状态

**脚本特性**：
- 自动备份（防止数据丢失）
- 完整的错误处理
- 失败时自动回滚
- 详细的部署日志
- 彩色输出便于阅读

### 手动部署流程

如果你想手动控制每个步骤，可以按照以下流程操作：

#### 第1步：本地开发和测试

使用Cursor或本地编辑器修改代码：

```bash
# 1. 在Cursor中打开项目
# 2. 按照 CURSOR_WORKFLOW.md 进行修改
# 3. 在终端运行测试
pnpm test

# 4. 确保所有测试通过
```

#### 第2步：提交到GitHub

```bash
# 1. 添加文件
git add .

# 2. 提交代码（使用清晰的commit message）
git commit -m "feat: 添加新功能描述"

# 3. 推送到GitHub
git push github main
```

#### 第3步：在Manus UI中发布

当代码推送到GitHub后，手动发布到生产环境：

1. **访问Manus Management UI**
   - 打开 https://manus.space
   - 登录你的Manus账户

2. **进入项目仪表板**
   - 找到"personal-portfolio"项目
   - 点击进入项目管理界面

3. **点击Publish按钮**
   - 在右上角找到"Publish"按钮
   - 点击发布最新的checkpoint
   - 等待部署完成（通常需要1-2分钟）

4. **验证部署**
   - 访问 https://persfolio-iet8jqpk.manus.space/
   - 检查新功能是否正确显示

## 部署脚本详解

### scripts/deploy.sh

**用途**：自动化本地部署流程，包括测试、构建、提交和失败回滚

**主要功能**：

| 功能 | 说明 |
|------|------|
| 备份创建 | 在部署前创建完整备份 |
| 依赖检查 | 验证pnpm已安装 |
| 单元测试 | 运行所有28项测试 |
| 类型检查 | 运行TypeScript检查 |
| 项目构建 | 构建前端和后端 |
| Git提交 | 提交到GitHub |
| 自动回滚 | 失败时自动恢复到之前状态 |
| 部署日志 | 生成详细的部署日志 |

**执行流程**：

```
1. 创建备份
   - 保存当前commit
   - 保存当前分支
   - 备份node_modules

2. 运行测试
   - 单元测试
   - TypeScript检查
   - 项目构建

3. 提交到GitHub
   - Git add
   - Git commit
   - Git push

4. 失败处理
   - 检测到错误
   - 自动回滚
   - 恢复备份
   - 生成日志
```

**回滚机制**：

脚本使用 `trap` 捕获所有错误，当任何步骤失败时会自动执行以下操作：

1. **Git回滚**：`git reset --hard <commit-hash>` 恢复到之前的commit
2. **依赖恢复**：恢复备份的node_modules
3. **清理备份**：删除临时备份文件
4. **生成日志**：保存部署日志供查看

**部署日志**：

每次运行脚本都会生成一个日志文件：`deploy-YYYYMMDD-HHMMSS.log`

```bash
# 查看最新的部署日志
cat deploy-*.log

# 查看特定日期的日志
cat deploy-20240115-143022.log
```

## 常见问题

### Q: deploy.sh脚本失败了怎么办？

**A**: 脚本会自动回滚。查看生成的部署日志了解失败原因：

```bash
# 查看最新的部署日志
cat deploy-*.log | tail -50

# 或查看特定日期的日志
cat deploy-20240115-143022.log
```

常见失败原因：
- **测试失败**：修复测试失败的代码，重新运行脚本
- **TypeScript错误**：修复类型错误，重新运行脚本
- **构建失败**：检查构建错误，修复后重新运行脚本
- **Git推送失败**：检查网络连接和GitHub凭证

### Q: 如何查看部署日志？

**A**: 每次运行 `./scripts/deploy.sh` 都会生成一个日志文件：

```bash
# 列出所有部署日志
ls -la deploy-*.log

# 查看最新的日志
cat deploy-*.log | tail -100

# 查看特定日志
cat deploy-20240115-143022.log
```

### Q: 脚本创建的备份在哪里？

**A**: 备份保存在 `.deploy-backup/` 目录中。脚本成功完成后会自动删除备份。如果部署失败，备份会被用于回滚，然后删除。

### Q: 如何手动回滚部署？

**A**: 如果脚本的自动回滚没有完全恢复，可以手动回滚：

```bash
# 查看commit历史
git log --oneline

# 回滚到特定commit
git reset --hard <commit-hash>

# 或使用Manus UI回滚
# 1. 进入项目Dashboard
# 2. 找到"Checkpoints"部分
# 3. 点击上一个版本的"Rollback"按钮
```

### Q: 如何跳过自动化测试？

**A**: **不建议跳过测试**。测试确保代码质量。但如果必须跳过，可以直接使用git命令：

```bash
# 跳过脚本，直接提交
git add .
git commit -m "fix: 紧急修复"
git push github main
```

### Q: 部署后网站没有更新怎么办？

**A**:
1. 清除浏览器缓存（Ctrl+Shift+Delete）
2. 等待2-3分钟让CDN更新
3. 访问 https://persfolio-iet8jqpk.manus.space/
4. 如果仍未更新，检查Manus Management UI中的部署日志

### Q: 可以同时部署多个版本吗？

**A**: 不可以。Manus平台一次只能有一个活跃版本。新的部署会覆盖旧版本。如需保留旧版本，可以在GitHub中创建release标签。

### Q: 脚本运行需要多长时间？

**A**: 通常需要2-5分钟，具体取决于：
- 测试数量（28项测试通常需要15-20秒）
- 项目大小（构建通常需要30-60秒）
- 网络速度（Git推送取决于网络）

可以通过部署日志查看每个步骤的耗时。

## 最佳实践

### 1. 提交前本地测试

```bash
# 总是在提交前运行测试
pnpm test

# 确保所有测试通过
# Test Files  4 passed (4)
# Tests  28 passed (28)
```

### 2. 使用清晰的Commit Message

```bash
# 好的例子
git commit -m "feat: 添加文章分类功能"
git commit -m "fix: 修复权限检查bug"
git commit -m "docs: 更新部署指南"

# 不好的例子
git commit -m "update"
git commit -m "fix stuff"
```

### 3. 定期更新依赖

```bash
# 每月检查一次依赖更新
pnpm update

# 运行测试确保兼容性
pnpm test

# 如果有问题，回滚更新
git checkout package.json pnpm-lock.yaml
```

### 4. 使用部署脚本而不是手动命令

```bash
# 推荐：使用脚本（包含备份和回滚）
./scripts/deploy.sh

# 不推荐：手动运行命令（没有备份和回滚）
pnpm test && pnpm build && git push
```

## 故障排除

### 问题：pnpm install 失败

```bash
# 解决方案：清除缓存重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 问题：测试超时

```bash
# 解决方案：增加测试超时时间
# 编辑 vitest.config.ts
export default defineConfig({
  test: {
    testTimeout: 30000, // 增加到30秒
  },
});
```

### 问题：构建失败

```bash
# 解决方案：检查TypeScript错误
pnpm check

# 修复错误后重新构建
pnpm build
```

### 问题：脚本权限不足

```bash
# 解决方案：添加执行权限
chmod +x scripts/deploy.sh

# 然后运行
./scripts/deploy.sh
```

## 回滚部署

### 自动回滚（deploy.sh脚本）

当使用 `./scripts/deploy.sh` 脚本时，任何步骤失败都会自动触发回滚：

```bash
# 脚本会自动：
# 1. 检测到错误
# 2. 执行 git reset --hard
# 3. 恢复备份的node_modules
# 4. 删除临时备份
# 5. 生成部署日志
```

### 手动回滚（Manus UI）

如果部署后在生产环境发现问题，可以在Manus UI中回滚：

1. **进入项目Dashboard**
   - 访问 https://manus.space
   - 找到"personal-portfolio"项目

2. **找到Checkpoints部分**
   - 在Dashboard中查看所有checkpoint
   - 找到要回滚的版本

3. **点击Rollback按钮**
   - 点击上一个版本旁的"Rollback"按钮
   - 确认回滚操作
   - 等待回滚完成

### 本地回滚（Git）

如果需要在本地回滚代码：

```bash
# 查看commit历史
git log --oneline

# 方式1：使用reset回滚（推荐用于本地）
git reset --hard <commit-hash>

# 方式2：使用revert创建新commit（推荐用于已推送的代码）
git revert <commit-hash>

# 推送回滚
git push github main
```

**何时使用哪种方式**：
- **reset**：代码还未推送到GitHub时使用
- **revert**：代码已推送到GitHub时使用（保留历史记录）

## 监控和维护

### 定期检查清单

| 任务 | 频率 | 说明 |
|------|------|------|
| 查看部署日志 | 每次部署后 | 确保部署成功 |
| 运行本地测试 | 每次提交前 | 确保代码质量 |
| 检查部署状态 | 每次发布后 | 确保网站正常运行 |
| 更新依赖 | 每月 | 保持依赖最新 |
| 备份数据 | 每周 | 防止数据丢失 |

### 性能监控

在Manus Management UI的Dashboard中查看：
- 网站访问量（UV/PV）
- 页面加载时间
- 错误日志

## 获取帮助

- **Cursor工作流问题**：查看 `CURSOR_WORKFLOW.md`
- **自动化设置问题**：查看 `AUTOMATION_SETUP.md`
- **开发问题**：查看 `DEVELOPMENT.md`
- **维护问题**：查看 `MAINTENANCE.md`

---

**记住**：好的自动化流程能显著提高开发效率和代码质量。定期维护和监控这些工作流，确保它们始终正常工作。
