import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { nanoid } from "nanoid";
import { ENV } from "./_core/env";

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

function createAuthContext(userId: number = 1, openId?: string): TrpcContext {
  const ctx: TrpcContext = {
    user: {
      id: userId,
      openId: openId || ENV.ownerOpenId || "test-owner-id",
      name: "Test User",
      email: "test@example.com",
      loginMethod: "oauth",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("articles router", () => {
  let testArticleId: string;
  const testSlug = "test-article-" + nanoid();

  it("should list published articles", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const articles = await caller.articles.list();

    expect(Array.isArray(articles)).toBe(true);
  });

  it("should create an article when authenticated", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.create({
      title: "Test Article",
      slug: testSlug,
      excerpt: "This is a test article",
      content: "# Test Article\n\nThis is the content of the test article.",
      tags: ["test", "blog"],
      status: "draft",
      password: "dlxbxy",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
    testArticleId = result.id;
  });

  it("should not create article without password", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.articles.create({
        title: "Unauthorized Article",
        slug: "unauthorized-article",
        excerpt: "This should fail",
        content: "This should fail",
        password: "wrong-password",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should get article by slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First create a published article
    const authCtx = createPublicContext();
    const authCaller = appRouter.createCaller(authCtx);

    const publishedSlug = "published-article-" + nanoid();
    await authCaller.articles.create({
      title: "Published Article",
      slug: publishedSlug,
      excerpt: "This is published",
      content: "# Published\n\nPublished content",
      status: "published",
      password: "dlxbxy",
    });

    // Then retrieve it
    const article = await caller.articles.getBySlug({ slug: publishedSlug });

    expect(article).toBeDefined();
    expect(article?.title).toBe("Published Article");
    expect(article?.status).toBe("published");
  });

  it("should update article when authenticated", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.update({
      id: testArticleId,
      title: "Updated Title",
      status: "published",
      password: "dlxbxy",
    });

    expect(result.success).toBe(true);

    // Verify the update
    const updated = await caller.articles.getById({ id: testArticleId });
    expect(updated?.title).toBe("Updated Title");
    expect(updated?.status).toBe("published");
  });

  it("should delete article when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create an article to delete
    const result = await caller.articles.create({
      title: "Article to Delete",
      slug: "delete-me-" + nanoid(),
      excerpt: "This will be deleted",
      content: "Delete this",
      password: "dlxbxy",
    });

    const articleIdToDelete = result.id;

    // Delete it
    const deleteResult = await caller.articles.delete({ id: articleIdToDelete, password: "dlxbxy" });
    expect(deleteResult.success).toBe(true);

    // Verify it's deleted
    const deleted = await caller.articles.getById({ id: articleIdToDelete });
    expect(deleted).toBeUndefined();
  });

  it("should not delete article without authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.articles.delete({ id: "some-id" });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should parse tags correctly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.create({
      title: "Article with Tags",
      slug: "tags-article-" + nanoid(),
      excerpt: "Testing tags",
      content: "# Tags Test",
      tags: ["community", "culture", "technology"],
      status: "draft",
      password: "dlxbxy",
    });

    const article = await caller.articles.getById({ id: result.id });
    expect(Array.isArray(article?.tags)).toBe(true);
    expect(article?.tags).toContain("community");
    expect(article?.tags).toContain("culture");
    expect(article?.tags).toContain("technology");
  });
});
