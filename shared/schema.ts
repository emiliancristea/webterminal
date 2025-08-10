import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable("sessions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  currentDirectory: text("current_directory").notNull().default("/home/user"),
  environmentVars: jsonb("environment_vars").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  lastActivity: timestamp("last_activity").defaultNow(),
});

export const commands = pgTable("commands", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  command: text("command").notNull(),
  output: text("output").notNull(),
  exitCode: text("exit_code").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const files = pgTable("files", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  path: text("path").notNull(),
  name: text("name").notNull(),
  content: text("content"),
  isDirectory: boolean("is_directory").notNull().default(false),
  permissions: text("permissions").notNull().default("755"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  userId: true,
  currentDirectory: true,
  environmentVars: true,
});

export const insertCommandSchema = createInsertSchema(commands).pick({
  sessionId: true,
  command: true,
  output: true,
  exitCode: true,
});

export const insertFileSchema = createInsertSchema(files).pick({
  sessionId: true,
  path: true,
  name: true,
  content: true,
  isDirectory: true,
  permissions: true,
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Command = typeof commands.$inferSelect;
export type InsertCommand = z.infer<typeof insertCommandSchema>;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
