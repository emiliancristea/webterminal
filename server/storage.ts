import {
  type Session,
  type InsertSession,
  type Command,
  type InsertCommand,
  type File,
  type InsertFile,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Session management
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  updateSession(
    id: string,
    updates: Partial<Session>,
  ): Promise<Session | undefined>;

  // Command history
  addCommand(command: InsertCommand): Promise<Command>;
  getCommandHistory(sessionId: string, limit?: number): Promise<Command[]>;

  // File system
  createFile(file: InsertFile): Promise<File>;
  getFile(sessionId: string, path: string): Promise<File | undefined>;
  getFilesByPath(sessionId: string, parentPath: string): Promise<File[]>;
  updateFile(id: string, updates: Partial<File>): Promise<File | undefined>;
  deleteFile(id: string): Promise<boolean>;
  getFileTree(sessionId: string): Promise<File[]>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, Session> = new Map();
  private commands: Map<string, Command> = new Map();
  private files: Map<string, File> = new Map();

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const session: Session = {
      userId: insertSession.userId || null,
      currentDirectory: insertSession.currentDirectory || "/home/user",
      environmentVars: insertSession.environmentVars || {},
      id,
      createdAt: new Date(),
      lastActivity: new Date(),
    };
    this.sessions.set(id, session);

    // Create initial file system structure
    await this.initializeFileSystem(id);

    return session;
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async updateSession(
    id: string,
    updates: Partial<Session>,
  ): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates, lastActivity: new Date() };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async addCommand(insertCommand: InsertCommand): Promise<Command> {
    const id = randomUUID();
    const command: Command = {
      ...insertCommand,
      id,
      timestamp: new Date(),
    };
    this.commands.set(id, command);
    return command;
  }

  async getCommandHistory(sessionId: string, limit = 50): Promise<Command[]> {
    return Array.from(this.commands.values())
      .filter((cmd) => cmd.sessionId === sessionId)
      .sort((a, b) => b.timestamp!.getTime() - a.timestamp!.getTime())
      .slice(0, limit)
      .reverse();
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = {
      sessionId: insertFile.sessionId,
      path: insertFile.path,
      name: insertFile.name,
      content: insertFile.content || null,
      isDirectory: insertFile.isDirectory || false,
      permissions: insertFile.permissions || "644",
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.files.set(id, file);
    return file;
  }

  async getFile(sessionId: string, path: string): Promise<File | undefined> {
    return Array.from(this.files.values()).find(
      (file) => file.sessionId === sessionId && file.path === path,
    );
  }

  async getFilesByPath(sessionId: string, parentPath: string): Promise<File[]> {
    return Array.from(this.files.values()).filter(
      (file) =>
        file.sessionId === sessionId &&
        file.path.startsWith(parentPath) &&
        file.path !== parentPath,
    );
  }

  async updateFile(
    id: string,
    updates: Partial<File>,
  ): Promise<File | undefined> {
    const file = this.files.get(id);
    if (!file) return undefined;

    const updatedFile = { ...file, ...updates, updatedAt: new Date() };
    this.files.set(id, updatedFile);
    return updatedFile;
  }

  async deleteFile(id: string): Promise<boolean> {
    return this.files.delete(id);
  }

  async getFileTree(sessionId: string): Promise<File[]> {
    return Array.from(this.files.values())
      .filter((file) => file.sessionId === sessionId)
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
  }

  private async initializeFileSystem(sessionId: string): Promise<void> {
    // Create home directory structure
    const homeDir: InsertFile = {
      sessionId,
      path: "/home",
      name: "home",
      isDirectory: true,
      permissions: "755",
    };

    const userDir: InsertFile = {
      sessionId,
      path: "/home/user",
      name: "user",
      isDirectory: true,
      permissions: "755",
    };

    const projectsDir: InsertFile = {
      sessionId,
      path: "/home/user/projects",
      name: "projects",
      isDirectory: true,
      permissions: "755",
    };

    const webappDir: InsertFile = {
      sessionId,
      path: "/home/user/projects/webapp",
      name: "webapp",
      isDirectory: true,
      permissions: "755",
    };

    // Create some sample files
    const appPy: InsertFile = {
      sessionId,
      path: "/home/user/app.py",
      name: "app.py",
      content: `#!/usr/bin/env python3
import os
import sys

def main():
    print("Hello, WebTerminal!")

if __name__ == "__main__":
    main()`,
      isDirectory: false,
      permissions: "755",
    };

    const readme: InsertFile = {
      sessionId,
      path: "/home/user/readme.txt",
      name: "readme.txt",
      content:
        "Welcome to WebTerminal!\n\nThis is a real Linux environment running in your browser.\n\nTry running some commands:\n- ls -la\n- cat app.py\n- python3 app.py",
      isDirectory: false,
      permissions: "644",
    };

    const config: InsertFile = {
      sessionId,
      path: "/home/user/config.json",
      name: "config.json",
      content: `{
  "terminal": {
    "theme": "dark",
    "fontSize": 14,
    "fontFamily": "JetBrains Mono"
  },
  "environment": {
    "shell": "/bin/bash",
    "locale": "en_US.UTF-8"
  }
}`,
      isDirectory: false,
      permissions: "644",
    };

    await this.createFile(homeDir);
    await this.createFile(userDir);
    await this.createFile(projectsDir);
    await this.createFile(webappDir);
    await this.createFile(appPy);
    await this.createFile(readme);
    await this.createFile(config);
  }
}

export const storage = new MemStorage();
