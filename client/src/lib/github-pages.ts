/**
 * GitHub Pages compatibility utilities
 * Detects when running on GitHub Pages and provides fallback functionality
 */

export interface DemoTerminalOutput {
  id: string;
  type: "command" | "output" | "error";
  content: string;
  timestamp: Date;
  exitCode?: string;
}

// Detect if we're running on GitHub Pages
export function isGitHubPages(): boolean {
  if (typeof window === "undefined") return false;
  
  // Check for GitHub Pages specific conditions
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // GitHub Pages URLs: username.github.io/repo or custom domain
  return (
    hostname.endsWith('.github.io') ||
    pathname.startsWith('/webterminal/') ||
    // Check if we're in a static environment (no backend)
    !window.location.port && window.location.protocol === 'https:'
  );
}

// Check if backend is available
export async function isBackendAvailable(): Promise<boolean> {
  try {
    // Use AbortController for timeout functionality
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch('/api/health', { 
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

// Generate demo terminal output for GitHub Pages
export function generateDemoOutput(): DemoTerminalOutput[] {
  const demoCommands = [
    {
      command: "echo 'Welcome to Web Terminal Demo!'",
      output: "Welcome to Web Terminal Demo!"
    },
    {
      command: "ls -la",
      output: `total 24
drwxr-xr-x  4 user user 4096 Nov 20 10:30 .
drwxr-xr-x  3 root root 4096 Nov 20 10:29 ..
-rw-r--r--  1 user user  220 Nov 20 10:29 .bash_logout
-rw-r--r--  1 user user 3771 Nov 20 10:29 .bashrc
-rw-r--r--  1 user user  807 Nov 20 10:29 .profile
drwxr-xr-x  2 user user 4096 Nov 20 10:30 Documents
drwxr-xr-x  2 user user 4096 Nov 20 10:30 Downloads`
    },
    {
      command: "pwd",
      output: "/home/user"
    },
    {
      command: "echo $USER",
      output: "user"
    },
    {
      command: "date",
      output: new Date().toString()
    },
    {
      command: "uname -a",
      output: "Linux webterminal 5.15.0 #1 SMP Web Terminal Demo x86_64 GNU/Linux"
    }
  ];

  const output: DemoTerminalOutput[] = [];
  let id = 1;

  demoCommands.forEach((demo) => {
    // Add command
    output.push({
      id: `demo-${id++}`,
      type: "command",
      content: demo.command,
      timestamp: new Date(Date.now() - (demoCommands.length - id) * 1000),
      exitCode: "0"
    });

    // Add output
    output.push({
      id: `demo-${id++}`,
      type: "output", 
      content: demo.output,
      timestamp: new Date(Date.now() - (demoCommands.length - id) * 1000 + 100),
      exitCode: "0"
    });
  });

  return output;
}

// Demo session info
export const demoPrompt = {
  user: "demo",
  hostname: "webterminal",
  directory: "~"
};

// Demo session ID
export const demoSessionId = "demo-session-github-pages";