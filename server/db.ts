import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

import { projects, contactSubmissions, InsertContactSubmission, articles, InsertArticle, Article } from "../drizzle/schema";

// Project queries
export async function getAllProjects() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get projects: database not available");
    return [];
  }

  try {
    const result = await db.select().from(projects);
    return result.map(p => ({
      ...p,
      tags: JSON.parse(p.tags),
      highlights: JSON.parse(p.highlights),
      learnings: JSON.parse(p.learnings)
    }));
  } catch (error) {
    console.error("[Database] Failed to get projects:", error);
    return [];
  }
}

export async function getProjectById(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get project: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (result.length === 0) return undefined;
    
    const p = result[0];
    return {
      ...p,
      tags: JSON.parse(p.tags),
      highlights: JSON.parse(p.highlights),
      learnings: JSON.parse(p.learnings)
    };
  } catch (error) {
    console.error("[Database] Failed to get project:", error);
    return undefined;
  }
}

export async function updateProject(id: string, data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update project: database not available");
    return undefined;
  }

  try {
    const updateData: any = { ...data };
    if (data.tags) {
      updateData.tags = JSON.stringify(data.tags);
    }
    if (data.highlights) {
      updateData.highlights = JSON.stringify(data.highlights);
    }
    if (data.learnings) {
      updateData.learnings = JSON.stringify(data.learnings);
    }
    
    await db.update(projects).set(updateData).where(eq(projects.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to update project:", error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete project: database not available");
    return undefined;
  }

  try {
    await db.delete(projects).where(eq(projects.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to delete project:", error);
    throw error;
  }
}

// Contact submission queries
export async function createContactSubmission(data: InsertContactSubmission) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create contact submission: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(contactSubmissions).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create contact submission:", error);
    throw error;
  }
}

export async function getAllContactSubmissions() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact submissions: database not available");
    return [];
  }

  try {
    const { desc } = await import("drizzle-orm");
    const result = await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get contact submissions:", error);
    return [];
  }
}

export async function getContactSubmissionById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact submission: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get contact submission:", error);
    return undefined;
  }
}

export async function updateContactSubmission(id: number, data: { status?: string; reply?: string; repliedAt?: Date }) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update contact submission: database not available");
    return undefined;
  }

  try {
    await db
      .update(contactSubmissions)
      .set(data as any)
      .where(eq(contactSubmissions.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to update contact submission:", error);
    throw error;
  }
}

export async function deleteContactSubmission(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete contact submission: database not available");
    return undefined;
  }

  try {
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to delete contact submission:", error);
    throw error;
  }
}

// Article queries
export async function getAllPublishedArticles() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get articles: database not available");
    return [];
  }

  try {
    const { desc } = await import("drizzle-orm");
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt));
    
    return result.map(a => ({
      ...a,
      tags: a.tags ? JSON.parse(a.tags) : []
    }));
  } catch (error) {
    console.error("[Database] Failed to get articles:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get article: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1);
    
    if (result.length === 0) return undefined;
    
    const a = result[0];
    return {
      ...a,
      tags: a.tags ? JSON.parse(a.tags) : []
    };
  } catch (error) {
    console.error("[Database] Failed to get article:", error);
    return undefined;
  }
}

export async function getArticleById(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get article: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);
    
    if (result.length === 0) return undefined;
    
    const a = result[0];
    return {
      ...a,
      tags: a.tags ? JSON.parse(a.tags) : []
    };
  } catch (error) {
    console.error("[Database] Failed to get article:", error);
    return undefined;
  }
}

export async function createArticle(data: InsertArticle) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create article: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(articles).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create article:", error);
    throw error;
  }
}

export async function updateArticle(id: string, data: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update article: database not available");
    return undefined;
  }

  try {
    const result = await db
      .update(articles)
      .set(data)
      .where(eq(articles.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update article:", error);
    throw error;
  }
}

export async function deleteArticle(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete article: database not available");
    return undefined;
  }

  try {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to delete article:", error);
    throw error;
  }
}
