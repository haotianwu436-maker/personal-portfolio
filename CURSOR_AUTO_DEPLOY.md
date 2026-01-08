# Cursor 自动化部署完整指南

本文档为Cursor提供完整的自动化开发和部署流程。按照此指南，Cursor可以接收自然语言指令，自动开发功能、运行测试、提交代码、创建checkpoint并发布到网站。

## 工作流概览

```
用户指令 → Cursor开发 → 自动测试 → 提交GitHub → 创建Checkpoint → 发布到Manus → 通知用户
```

## 第一步：接收用户指令

当用户给你发送自然语言指令时，你应该：

1. **理解需求**：仔细阅读用户的需求描述
2. **确认范围**：如果需求不清楚，询问用户以获得更多信息
3. **规划实现**：在开始编码前，向用户说明你的实现计划

### 示例指令

用户可能会这样说：
> "我想在首页添加一个新闻通讯订阅框，放在Contact部分上面。用户可以输入邮箱，点击订阅按钮后显示'感谢订阅'的提示。"

你应该回复：
> "我理解了。我会：
> 1. 在Home.tsx的Contact部分上方添加Newsletter组件
> 2. 创建订阅表单，包含邮箱输入和提交按钮
> 3. 调用后端API保存邮箱
> 4. 显示成功提示
> 5. 运行测试确保功能正常
> 6. 自动提交代码和发布
> 
> 开始实现..."

## 第二步：开发功能

### 2.1 更新TODO清单

在开始任何开发前，**必须**更新`todo.md`文件：

```bash
# 在todo.md中添加新任务
- [ ] 实现Newsletter组件
- [ ] 创建订阅API端点
- [ ] 编写订阅功能测试
- [ ] 集成到首页
```

### 2.2 遵循项目规范

开发时必须遵循这些规范：

**代码风格**：
- 使用TypeScript，避免使用`any`类型
- 组件使用函数式组件和Hooks
- 使用Tailwind CSS进行样式设计
- 遵循项目的"Quiet Narrative"设计风格（米色背景、深灰色文字、森林绿强调色）

**文件位置**：
- 页面组件放在 `client/src/pages/`
- UI组件放在 `client/src/components/`
- Hooks放在 `client/src/_core/hooks/`
- API路由放在 `server/routers.ts`
- 数据库查询放在 `server/db.ts`

**数据库操作**：
- 如果需要新表，在 `drizzle/schema.ts` 中定义
- 运行 `pnpm db:push` 应用迁移
- 在 `server/db.ts` 中创建查询函数

### 2.3 实现功能示例

假设你要添加Newsletter订阅功能：

**1. 创建数据库表** (`drizzle/schema.ts`)
```typescript
export const newsletters = createTable("newsletter", (t) => ({
  id: t.text("id").primaryKey().$defaultFn(() => nanoid()),
  email: t.text("email").notNull().unique(),
  createdAt: t.timestamp("created_at").defaultNow(),
}));
```

**2. 创建数据库查询** (`server/db.ts`)
```typescript
export async function subscribeNewsletter(email: string) {
  return db.insert(newsletters).values({ email });
}
```

**3. 创建API端点** (`server/routers.ts`)
```typescript
newsletter: publicProcedure
  .input(z.object({ email: z.string().email() }))
  .mutation(async ({ input }) => {
    await subscribeNewsletter(input.email);
    return { success: true };
  }),
```

**4. 创建React组件** (`client/src/components/Newsletter.tsx`)
```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const mutation = trpc.newsletter.useMutation({
    onSuccess: () => {
      toast.success("感谢订阅！");
      setEmail("");
    },
    onError: (error) => {
      toast.error(error.message || "订阅失败");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({ email });
      }}
      className="space-y-4"
    >
      <Input
        type="email"
        placeholder="输入你的邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" disabled={mutation.isPending}>
        订阅
      </Button>
    </form>
  );
}
```

**5. 集成到页面** (`client/src/pages/Home.tsx`)
```typescript
import Newsletter from "@/components/Newsletter";

// 在Contact部分上方添加
<section id="newsletter" className="section-padding">
  <Newsletter />
</section>
```

### 2.4 编写测试

对于API功能，必须编写测试。创建 `server/newsletter.test.ts`：

```typescript
import { describe, it, expect } from "vitest";
import { createTRPCMsw } from "trpc-msw";
import { appRouter } from "./routers";

describe("newsletter router", () => {
  it("should subscribe to newsletter", async () => {
    const result = await appRouter.createCaller({}).newsletter({
      email: "test@example.com",
    });
    expect(result.success).toBe(true);
  });
});
```

## 第三步：测试和验证

### 3.1 运行测试

在提交代码前，必须运行所有测试：

```bash
pnpm test
```

**要求**：
- 所有测试必须通过（✓）
- 没有TypeScript错误
- 没有ESLint警告

如果测试失败，修复问题直到所有测试通过。

### 3.2 检查项目状态

运行此命令检查项目健康状态：

```bash
pnpm build
```

确保没有构建错误。

## 第四步：提交代码到GitHub

### 4.1 更新TODO清单

将完成的任务标记为已完成：

```bash
# 在todo.md中，将 [ ] 改为 [x]
- [x] 实现Newsletter组件
- [x] 创建订阅API端点
- [x] 编写订阅功能测试
- [x] 集成到首页
```

### 4.2 提交到GitHub

使用以下命令提交代码：

```bash
cd /home/ubuntu/personal-portfolio

# 添加所有更改
git add .

# 提交代码，使用清晰的commit message
git commit -m "feat: add newsletter subscription feature

- Create newsletter database table
- Implement subscription API endpoint
- Build Newsletter React component
- Add subscription tests
- Integrate to home page"

# 推送到GitHub
git push origin main
```

**Commit Message规范**：
- 使用英文
- 格式：`type: short description`
- 类型包括：feat（新功能）、fix（修复）、docs（文档）、refactor（重构）、test（测试）
- 详细说明用bullet points

## 第五步：创建Checkpoint

Checkpoint是网站状态的快照，用于发布和回滚。

### 5.1 运行部署脚本

```bash
cd /home/ubuntu/personal-portfolio
./scripts/deploy.sh
```

这个脚本会自动：
1. 运行所有测试
2. 检查TypeScript类型
3. 构建项目
4. 创建checkpoint
5. 失败时自动回滚

### 5.2 脚本输出

脚本会输出类似这样的信息：

```
✓ All tests passed (28 tests)
✓ TypeScript check passed
✓ Build successful
✓ Checkpoint created: version_8639ded8
✓ Ready to publish!
```

**如果失败**：脚本会自动回滚，显示错误信息。修复问题后重新运行。

## 第六步：发布到Manus

### 6.1 获取Checkpoint版本

从脚本输出中获取checkpoint版本号（例如：`714ff250`）

### 6.2 在Manus UI中发布

1. 访问 https://manus.space
2. 进入项目Dashboard
3. 点击最新的Checkpoint卡片
4. 点击"Publish"按钮
5. 等待发布完成（通常30秒内）

### 6.3 验证发布

发布完成后，访问网站链接验证新功能是否正常工作。

## 第七步：通知用户

部署完成后，向用户报告：

```
✅ 功能已完成并发布！

实现内容：
- ✓ Newsletter订阅组件
- ✓ 邮箱验证和存储
- ✓ 成功提示
- ✓ 28项测试全部通过

访问链接查看：https://[your-domain].manus.space

下一步建议：
1. 添加邮件发送功能
2. 实现订阅管理页面
3. 添加邮件模板
```

## 完整工作流检查清单

每次接收用户指令时，按照这个清单操作：

- [ ] 理解用户需求，确认实现计划
- [ ] 更新todo.md，添加新任务
- [ ] 开发功能（遵循项目规范）
- [ ] 编写测试（如果是API功能）
- [ ] 运行`pnpm test`，确保所有测试通过
- [ ] 运行`pnpm build`，确保没有构建错误
- [ ] 更新todo.md，标记任务完成
- [ ] 使用`git add .`和`git commit -m "..."`提交代码
- [ ] 使用`git push origin main`推送到GitHub
- [ ] 运行`./scripts/deploy.sh`创建checkpoint
- [ ] 在Manus UI中点击Publish发布
- [ ] 访问网站验证功能
- [ ] 向用户报告完成情况

## 常见问题

**Q: 如果测试失败怎么办？**
A: 修复代码中的问题，重新运行`pnpm test`直到所有测试通过。不要跳过这一步。

**Q: 如果build失败怎么办？**
A: 检查TypeScript错误，修复后重新运行`pnpm build`。

**Q: 如果deploy.sh失败怎么办？**
A: 脚本会自动回滚。检查错误信息，修复问题后重新运行脚本。

**Q: 如何修改密码？**
A: 编辑`client/src/_core/hooks/useEditPassword.ts`，修改`EDIT_PASSWORD`常量。

**Q: 如何添加新的环境变量？**
A: 在Manus UI的Settings → Secrets中添加，然后在代码中使用`process.env.YOUR_VAR_NAME`。

## 项目特殊配置

**密码保护**：
- 编辑密码存储在：`client/src/_core/hooks/useEditPassword.ts`
- 默认密码：`admin123`
- 会话时间：30分钟

**设计系统**：
- 主色：森林绿（`#2d5016`）
- 背景：米色（`#f5f1e8`）
- 文字：深灰色（`#2c2c2c`）
- 详见：`client/src/index.css`

**API基础URL**：
- 前端：`VITE_FRONTEND_FORGE_API_URL`
- 后端：`BUILT_IN_FORGE_API_URL`

## 成功标志

当你完成一个功能时，应该看到：

1. ✓ 所有28项测试通过
2. ✓ TypeScript编译无错误
3. ✓ Build成功
4. ✓ Checkpoint已创建
5. ✓ 网站已发布
6. ✓ 新功能在网站上可见

如果以上任何一项失败，停止并修复问题。
