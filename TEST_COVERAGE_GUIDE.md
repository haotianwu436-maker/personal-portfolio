# 自动化测试覆盖率检查指南

本文档说明如何在项目中配置和使用自动化测试覆盖率检查，确保所有新功能都经过充分测试。

## 📊 覆盖率目标

| 指标 | 目标 | 说明 |
|------|------|------|
| 行覆盖率（Lines） | ≥ 80% | 代码行数的覆盖比例 |
| 函数覆盖率（Functions） | ≥ 80% | 函数的覆盖比例 |
| 分支覆盖率（Branches） | ≥ 75% | 条件分支的覆盖比例 |
| 语句覆盖率（Statements） | ≥ 80% | 代码语句的覆盖比例 |

## 🧪 运行测试覆盖率检查

### 基础命令

```bash
# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test -- --coverage

# 生成HTML覆盖率报告
pnpm test -- --coverage --reporter=html
```

### 查看覆盖率报告

```bash
# 生成后，在浏览器中打开HTML报告
open coverage/index.html

# 或在Linux中
xdg-open coverage/index.html
```

## 📈 覆盖率报告说明

运行 `pnpm test -- --coverage` 后，会生成以下文件：

```
coverage/
├── index.html           # HTML格式的详细报告
├── coverage-final.json  # JSON格式的原始数据
├── lcov.info           # LCOV格式的报告
└── lcov-report/        # LCOV HTML报告
```

### 报告内容

**文本报告**：
```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   85.2  |   78.5   |   88.3  |   85.5  |
 server/  |   85.2  |   78.5   |   88.3  |   85.5  |
  db.ts   |   92.1  |   85.7   |   95.2  |   92.3  |
  routers |   78.5  |   72.3   |   81.2  |   78.9  | 45,67,89
----------|---------|----------|---------|---------|-------------------
```

**HTML报告**：
- 显示每个文件的覆盖率
- 高亮显示未覆盖的代码行
- 提供详细的覆盖率分析

## ✅ 覆盖率检查规则

### 必须通过的条件

1. **整体覆盖率** ≥ 80%
2. **API端点覆盖率** = 100%（所有API都必须有测试）
3. **核心业务逻辑覆盖率** ≥ 90%
4. **没有新增的未覆盖代码**

### 失败时的处理

如果覆盖率不达标，部署脚本会：

1. 显示覆盖率报告
2. 列出未覆盖的代码
3. 拒绝部署
4. 提示需要添加测试

## 🔧 配置说明

### vitest.config.ts

项目的覆盖率配置在 `vitest.config.ts` 中：

```typescript
test: {
  coverage: {
    provider: "v8",                    // 使用V8引擎
    reporter: ["text", "json", "html"], // 生成多种格式报告
    include: ["server/**/*.ts"],        // 包含的文件
    exclude: [                          // 排除的文件
      "server/**/*.test.ts",
      "server/**/*.spec.ts",
      "node_modules/**",
    ],
    lines: 80,      // 行覆盖率目标
    functions: 80,  // 函数覆盖率目标
    branches: 75,   // 分支覆盖率目标
    statements: 80, // 语句覆盖率目标
    all: true,      // 检查所有文件
  },
}
```

## 📝 编写测试以提高覆盖率

### 1. API端点测试

```typescript
import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("articles router", () => {
  // 正常情况
  it("should list all articles", async () => {
    const result = await appRouter.createCaller({}).articles.list();
    expect(Array.isArray(result)).toBe(true);
  });

  // 错误情况
  it("should throw error when creating without auth", async () => {
    expect(async () => {
      await appRouter.createCaller({}).articles.create({
        title: "Test",
        content: "Test",
      });
    }).rejects.toThrow("Unauthorized");
  });

  // 边界情况
  it("should handle empty input", async () => {
    expect(async () => {
      await appRouter.createCaller({}).articles.create({
        title: "",
        content: "",
      });
    }).rejects.toThrow();
  });
});
```

### 2. 数据库函数测试

```typescript
describe("database functions", () => {
  it("should create article with correct data", async () => {
    const article = await createArticle({
      title: "Test Article",
      content: "Test content",
    });

    expect(article.id).toBeDefined();
    expect(article.title).toBe("Test Article");
    expect(article.createdAt).toBeDefined();
  });

  it("should handle database errors", async () => {
    expect(async () => {
      await createArticle({
        title: null as any,
        content: "Test",
      });
    }).rejects.toThrow();
  });
});
```

### 3. 工具函数测试

```typescript
describe("utility functions", () => {
  it("should format date correctly", () => {
    const date = new Date("2026-01-08");
    expect(formatDate(date)).toBe("2026-01-08");
  });

  it("should handle edge cases", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
  });
});
```

## 🚀 在部署流程中集成覆盖率检查

### deploy.sh脚本

部署脚本会自动：

1. 运行所有测试
2. 检查覆盖率
3. 生成覆盖率报告
4. 如果覆盖率不达标，停止部署

```bash
#!/bin/bash

echo "🧪 运行测试并检查覆盖率..."
pnpm test -- --coverage

if [ $? -ne 0 ]; then
  echo "❌ 测试失败或覆盖率不达标！"
  echo "📊 请查看覆盖率报告：coverage/index.html"
  exit 1
fi

echo "✅ 所有测试通过，覆盖率达标！"
```

## 📊 监控覆盖率趋势

### 保存覆盖率报告

每次部署时保存覆盖率报告，以便追踪趋势：

```bash
# 保存覆盖率报告到历史文件
cp coverage/coverage-final.json "coverage-reports/$(date +%Y%m%d-%H%M%S).json"
```

### 生成趋势图表

使用工具（如 Codecov）可视化覆盖率趋势：

```bash
# 上传到Codecov（需要配置）
bash <(curl -s https://codecov.io/bash)
```

## ⚠️ 常见问题

### Q: 为什么覆盖率报告显示0%？

**A**: 可能是以下原因：
1. 没有运行测试（`pnpm test`）
2. 测试文件不在 `include` 路径中
3. 代码文件不在 `include` 路径中

**解决方案**：
```bash
# 检查vitest.config.ts中的include配置
# 确保测试文件和代码文件都被包含
```

### Q: 某个文件的覆盖率很低，怎么办？

**A**: 需要为该文件添加更多测试。

**步骤**：
1. 打开HTML报告：`coverage/index.html`
2. 找到覆盖率低的文件
3. 点击查看未覆盖的代码行
4. 为这些代码编写测试

### Q: 如何忽略某些代码行的覆盖率检查？

**A**: 使用 `/* c8 ignore next */` 注释：

```typescript
// 忽略下一行
/* c8 ignore next */
if (process.env.NODE_ENV === "test") {
  // 测试代码
}

// 忽略整个块
/* c8 ignore start */
function debugHelper() {
  // 调试代码
}
/* c8 ignore end */
```

## 📚 相关文档

- [Vitest 覆盖率文档](https://vitest.dev/guide/coverage.html)
- [V8 覆盖率](https://v8.dev/blog/code-coverage)
- [测试最佳实践](./CURSOR_WORKFLOW.md)

## 🎯 下一步

1. **运行覆盖率检查**：`pnpm test -- --coverage`
2. **查看报告**：打开 `coverage/index.html`
3. **添加缺失的测试**：为未覆盖的代码编写测试
4. **在部署前验证**：确保覆盖率达标

---

**保持高的测试覆盖率，确保代码质量！** 🎯
