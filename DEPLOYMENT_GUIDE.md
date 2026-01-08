# 部署指南

本文档说明如何使用自动化流程部署个人作品集网站。

## 自动化部署流程

项目已配置了完整的自动化部署流程，包括自动测试和部署检查。

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
│ 2. GitHub Actions 自动化                                    │
│    - 自动运行所有测试                                       │
│    - 自动构建项目                                           │
│    - 生成部署报告                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  测试是否通过?        │
        └──────────┬───────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
       YES                    NO
        │                     │
        ▼                     ▼
    ✅ 通过              ❌ 失败
    准备部署             修复代码
        │                 重新提交
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

### 第1步：本地开发和测试

使用Cursor或本地编辑器修改代码：

```bash
# 1. 在Cursor中打开项目
# 2. 按照 CURSOR_WORKFLOW.md 进行修改
# 3. 在终端运行测试
pnpm test

# 4. 确保所有测试通过
```

### 第2步：提交到GitHub

```bash
# 1. 添加文件
git add .

# 2. 提交代码（使用清晰的commit message）
git commit -m "feat: 添加新功能描述"

# 3. 推送到GitHub
git push origin main
```

### 第3步：GitHub Actions自动验证

GitHub Actions会自动运行以下步骤：

| 步骤 | 说明 | 耗时 |
|------|------|------|
| 安装依赖 | 安装npm包 | ~30秒 |
| TypeScript检查 | 检查类型错误 | ~10秒 |
| 运行测试 | 执行所有单元测试 | ~15秒 |
| 构建项目 | 构建前端和后端 | ~30秒 |
| 生成报告 | 创建部署摘要 | ~5秒 |

**总耗时**：约2-3分钟

### 第4步：查看自动化结果

在GitHub仓库中查看工作流结果：

1. 访问 https://github.com/haotianwu436-maker/personal-portfolio/actions
2. 找到最新的工作流运行
3. 点击进入查看详细结果

**成功标志**：
- ✅ 所有检查通过（绿色勾号）
- ✅ 测试全部通过（28/28）
- ✅ 构建成功

**失败处理**：
- ❌ 如果有失败，查看错误信息
- ❌ 在本地修复问题
- ❌ 重新运行 `pnpm test`
- ❌ 提交修复后的代码

### 第5步：在Manus UI中发布

当GitHub Actions验证通过后，手动发布到生产环境：

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

## 工作流文件说明

### .github/workflows/test.yml

**用途**：在每次push和pull request时自动运行测试

**触发条件**：
- 推送到 `main` 或 `develop` 分支
- 创建pull request到 `main` 或 `develop` 分支

**执行步骤**：
1. 检出代码
2. 安装pnpm和Node.js
3. 安装依赖
4. 运行TypeScript检查
5. 运行单元测试
6. 构建项目
7. 上传构建产物

### .github/workflows/deploy.yml

**用途**：在测试通过后准备部署

**触发条件**：
- test.yml工作流成功完成
- 或直接推送到main分支

**执行步骤**：
1. 运行所有测试
2. 构建项目
3. 生成部署摘要
4. 在GitHub Actions中显示部署说明

## 常见问题

### Q: 如何查看测试结果？

**A**: 
1. 访问 https://github.com/haotianwu436-maker/personal-portfolio/actions
2. 点击最新的工作流运行
3. 查看"Test and Build"任务的详细输出

### Q: 测试失败了怎么办？

**A**:
1. 查看GitHub Actions中的错误信息
2. 在本地运行 `pnpm test` 重现问题
3. 修复代码
4. 运行 `pnpm test` 验证修复
5. 提交修复后的代码

### Q: 如何跳过自动化测试？

**A**: **不建议跳过测试**。测试确保代码质量。但如果必须跳过，可以在commit message中添加 `[skip ci]`：

```bash
git commit -m "fix: 紧急修复 [skip ci]"
```

### Q: 部署后网站没有更新怎么办？

**A**:
1. 清除浏览器缓存（Ctrl+Shift+Delete）
2. 等待2-3分钟让CDN更新
3. 访问 https://persfolio-iet8jqpk.manus.space/
4. 如果仍未更新，检查Manus Management UI中的部署日志

### Q: 可以同时部署多个版本吗？

**A**: 不可以。Manus平台一次只能有一个活跃版本。新的部署会覆盖旧版本。如需保留旧版本，可以在GitHub中创建release标签。

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
# ✅ 好的例子
git commit -m "feat: 添加文章分类功能"
git commit -m "fix: 修复权限检查bug"
git commit -m "docs: 更新部署指南"

# ❌ 不好的例子
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

### 4. 监控GitHub Actions

定期检查GitHub Actions的运行状态，确保自动化流程正常工作。

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

## 监控和维护

### 定期检查清单

| 任务 | 频率 | 说明 |
|------|------|------|
| 查看GitHub Actions日志 | 每周 | 确保自动化流程正常 |
| 运行本地测试 | 每次提交前 | 确保代码质量 |
| 检查部署状态 | 每次发布后 | 确保网站正常运行 |
| 更新依赖 | 每月 | 保持依赖最新 |
| 备份数据 | 每周 | 防止数据丢失 |

### 性能监控

在Manus Management UI的Dashboard中查看：
- 网站访问量（UV/PV）
- 页面加载时间
- 错误日志

## 回滚部署

如果部署后发现问题，可以回滚到上一个版本：

1. **在Manus Management UI中**：
   - 进入项目Dashboard
   - 找到"Checkpoints"部分
   - 点击上一个版本的"Rollback"按钮

2. **或在本地回滚**：
   ```bash
   # 查看commit历史
   git log --oneline
   
   # 回滚到特定commit
   git revert <commit-hash>
   
   # 推送回滚
   git push origin main
   ```

## 获取帮助

- **Cursor工作流问题**：查看 `CURSOR_WORKFLOW.md`
- **开发问题**：查看 `DEVELOPMENT.md`
- **维护问题**：查看 `MAINTENANCE.md`
- **GitHub Actions问题**：查看 [GitHub Actions文档](https://docs.github.com/en/actions)

---

**记住**：好的自动化流程能显著提高开发效率和代码质量。定期维护和监控这些工作流，确保它们始终正常工作。
