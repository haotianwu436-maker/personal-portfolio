import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getAllProjects, getProjectById, createContactSubmission, getAllContactSubmissions, getContactSubmissionById, updateContactSubmission, deleteContactSubmission, getAllPublishedArticles, getArticleBySlug, getArticleById, createArticle, updateArticle, deleteArticle } from "./db";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  projects: router({
    list: publicProcedure.query(async () => {
      return await getAllProjects();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await getProjectById(input.id);
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
        message: z.string().min(1, "Message is required"),
        subject: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          await createContactSubmission({
            name: input.name,
            email: input.email,
            message: input.message,
            subject: input.subject,
          });
          return { success: true };
        } catch (error) {
          console.error("Failed to submit contact form:", error);
          throw new Error("Failed to submit contact form");
        }
      }),
    list: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new Error("Unauthorized");
      }
      return await getAllContactSubmissions();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new Error("Unauthorized");
        }
        return await getContactSubmissionById(input.id);
      }),
    markAsRead: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new Error("Unauthorized");
        }
        return await updateContactSubmission(input.id, { status: "read" });
      }),
    reply: publicProcedure
      .input(z.object({
        id: z.number(),
        reply: z.string().min(1, "Reply is required"),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new Error("Unauthorized");
        }
        return await updateContactSubmission(input.id, {
          reply: input.reply,
          status: "replied",
          repliedAt: new Date(),
        });
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new Error("Unauthorized");
        }
        return await deleteContactSubmission(input.id);
      }),
  }),

  articles: router({
    list: publicProcedure.query(async () => {
      return await getAllPublishedArticles();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await getArticleBySlug(input.slug);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await getArticleById(input.id);
      }),
    create: publicProcedure
      .input(z.object({
        title: z.string().min(1, "Title is required"),
        slug: z.string().min(1, "Slug is required"),
        excerpt: z.string().min(1, "Excerpt is required"),
        content: z.string().min(1, "Content is required"),
        tags: z.array(z.string()).optional(),
        status: z.enum(["draft", "published"]).default("draft"),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new Error("Unauthorized");
        }
        try {
          const articleId = nanoid();
          const tagsJson = input.tags ? JSON.stringify(input.tags) : null;
          await createArticle({
            id: articleId,
            title: input.title,
            slug: input.slug,
            excerpt: input.excerpt,
            content: input.content,
            authorId: ctx.user.id,
            status: input.status,
            tags: tagsJson,
            publishedAt: input.status === "published" ? new Date() : null,
          });
          return { success: true, id: articleId };
        } catch (error) {
          console.error("Failed to create article:", error);
          throw new Error("Failed to create article");
        }
      }),
    update: publicProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: z.enum(["draft", "published"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new Error("Unauthorized");
        }
        try {
          const updateData: any = {};
          if (input.title) updateData.title = input.title;
          if (input.slug) updateData.slug = input.slug;
          if (input.excerpt) updateData.excerpt = input.excerpt;
          if (input.content) updateData.content = input.content;
          if (input.tags) updateData.tags = JSON.stringify(input.tags);
          if (input.status) {
            updateData.status = input.status;
            if (input.status === "published") {
              updateData.publishedAt = new Date();
            }
          }
          await updateArticle(input.id, updateData);
          return { success: true };
        } catch (error) {
          console.error("Failed to update article:", error);
          throw new Error("Failed to update article");
        }
      }),
    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new Error("Unauthorized");
        }
        try {
          await deleteArticle(input.id);
          return { success: true };
        } catch (error) {
          console.error("Failed to delete article:", error);
          throw new Error("Failed to delete article");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
