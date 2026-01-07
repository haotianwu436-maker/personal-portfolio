import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("projects router", () => {
  it("should list all projects", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const projects = await caller.projects.list();

    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it("should have correct project structure", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const projects = await caller.projects.list();
    const project = projects[0];

    expect(project).toHaveProperty("id");
    expect(project).toHaveProperty("title");
    expect(project).toHaveProperty("subtitle");
    expect(project).toHaveProperty("role");
    expect(project).toHaveProperty("tags");
    expect(project).toHaveProperty("image");
    expect(project).toHaveProperty("description");
    expect(project).toHaveProperty("content");
    expect(project).toHaveProperty("highlights");
    expect(project).toHaveProperty("impact");
    expect(project).toHaveProperty("learnings");
  });

  it("should have tags as array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const projects = await caller.projects.list();
    const project = projects[0];

    expect(Array.isArray(project.tags)).toBe(true);
    expect(project.tags.length).toBeGreaterThan(0);
  });

  it("should have highlights as array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const projects = await caller.projects.list();
    const project = projects[0];

    expect(Array.isArray(project.highlights)).toBe(true);
    expect(project.highlights.length).toBeGreaterThan(0);
  });

  it("should have learnings as array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const projects = await caller.projects.list();
    const project = projects[0];

    expect(Array.isArray(project.learnings)).toBe(true);
    expect(project.learnings.length).toBeGreaterThan(0);
  });

  it("should get project by id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const projects = await caller.projects.list();
    const firstProject = projects[0];

    const project = await caller.projects.getById({ id: firstProject.id });

    expect(project).toBeDefined();
    expect(project?.id).toBe(firstProject.id);
    expect(project?.title).toBe(firstProject.title);
  });

  it("should return undefined for non-existent project", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const project = await caller.projects.getById({ id: "non-existent-id" });

    expect(project).toBeUndefined();
  });
});

describe("contact router", () => {
  it("should submit contact form", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Test User",
      email: "test@example.com",
      message: "This is a test message",
      subject: "Test Subject",
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        name: "Test User",
        email: "invalid-email",
        message: "This is a test message",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        name: "",
        email: "test@example.com",
        message: "This is a test message",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject empty message", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        name: "Test User",
        email: "test@example.com",
        message: "",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
