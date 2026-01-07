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

function createAuthContext(userId: number = 1): TrpcContext {
  const ctx: TrpcContext = {
    user: {
      id: userId,
      openId: "test-user-" + userId,
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

describe("contact router", () => {
  let testMessageId: number;

  it("should submit a contact form", async () => {
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

  it("should list messages when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const messages = await caller.contact.list();

    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThan(0);
    
    // Store the first message ID for later tests
    testMessageId = messages[0].id;
  });

  it("should not list messages without authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.list();
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should get message by id when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const message = await caller.contact.getById({ id: testMessageId });

    expect(message).toBeDefined();
    expect(message?.id).toBe(testMessageId);
  });

  it("should mark message as read", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.markAsRead({ id: testMessageId });

    expect(result?.success).toBe(true);

    // Verify the status changed
    const message = await caller.contact.getById({ id: testMessageId });
    expect(message?.status).toBe("read");
  });

  it("should reply to a message", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.reply({
      id: testMessageId,
      reply: "Thank you for your message!",
    });

    expect(result?.success).toBe(true);

    // Verify the reply was saved
    const message = await caller.contact.getById({ id: testMessageId });
    expect(message?.status).toBe("replied");
    expect(message?.reply).toBe("Thank you for your message!");
    expect(message?.repliedAt).toBeDefined();
  });

  it("should not reply without authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.reply({
        id: testMessageId,
        reply: "Unauthorized reply",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should delete a message when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First submit a new message to delete
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);
    await publicCaller.contact.submit({
      name: "Delete Test",
      email: "delete@test.com",
      message: "This message will be deleted",
    });

    // Get the new message
    const messages = await caller.contact.list();
    const messageToDelete = messages.find(m => m.email === "delete@test.com");
    
    if (messageToDelete) {
      const result = await caller.contact.delete({ id: messageToDelete.id });
      expect(result?.success).toBe(true);
    }
  });
});
