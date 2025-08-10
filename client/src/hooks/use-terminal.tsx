import { useState, useCallback, useRef, useEffect } from "react";
import { useWebSocket } from "./use-websocket";
import { useDemoTerminal } from "./use-demo-terminal";
import { useRealTerminal } from "./use-real-terminal";

interface TerminalOutput {
  id: string;
  type: "command" | "output" | "error";
  content: string;
  timestamp: Date;
  exitCode?: string;
}

interface PromptInfo {
  user: string;
  hostname: string;
  directory: string;
}

interface UseTerminalOptions {
  sessionId: string;
}

export function useTerminal({ sessionId }: UseTerminalOptions) {
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const [useDemo, setUseDemo] = useState(false);

  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('/api/sessions', {
          method: 'HEAD',
          headers: { 'Accept': 'application/json' }
        });
        setBackendAvailable(response.ok);
        setUseDemo(!response.ok);
      } catch (error) {
        setBackendAvailable(false);
        setUseDemo(true);
      }
    };
    
    checkBackend();
  }, []);

  // Call all hooks unconditionally at the top level
  const demoTerminal = useDemoTerminal();
  const realTerminal = useRealTerminal({ sessionId });

  // If we're still checking backend availability, show loading state
  if (backendAvailable === null) {
    return {
      output: [],
      currentCommand: "",
      setCurrentCommand: () => {},
      prompt: { user: "user", hostname: "webterminal", directory: "~" },
      isConnected: false,
      isLoading: false,
      isInitializing: true,
      executeCommand: () => {},
      clearTerminal: () => {},
      navigateHistory: () => {},
      handleResize: () => {},
    };
  }

  // Return the appropriate terminal based on backend availability
  return useDemo ? demoTerminal : realTerminal;
}
