import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

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

interface TerminalOutputProps {
  output: TerminalOutput[];
  prompt: PromptInfo;
  currentCommand: string;
  isLoading: boolean;
  onFocus: () => void;
}

export function TerminalOutput({
  output,
  prompt,
  currentCommand,
  isLoading,
  onFocus,
}: TerminalOutputProps) {
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const formatOutput = (content: string) => {
    // Handle ANSI escape sequences for colors and formatting
    return content
      .replace(/\x1b\[2J\x1b\[H/g, "") // Clear screen sequences
      .split("\n")
      .map((line, index) => (
        <div key={index} className="min-h-[1em]">
          {line || "\u00A0"}
        </div>
      ));
  };

  const renderPrompt = (user: string, hostname: string, directory: string) => (
    <div className="flex items-center flex-wrap">
      <span className="text-terminal-green" data-testid="prompt-user">
        {user}@{hostname}
      </span>
      <span className="text-terminal-blue">:</span>
      <span className="text-terminal-blue" data-testid="prompt-directory">
        {directory}
      </span>
      <span className="text-terminal-white">$&nbsp;</span>
    </div>
  );

  return (
    <div
      ref={outputRef}
      className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed bg-terminal-black text-terminal-white cursor-text scrollbar-thin scrollbar-thumb-terminal-blue scrollbar-track-terminal-dark"
      onClick={onFocus}
      data-testid="terminal-output"
    >
      {/* Welcome Message */}
      <div className="mb-4">
        <div className="text-terminal-green">
          Welcome to WebTerminal v1.0 - Linux Environment
        </div>
        <div className="text-terminal-grey text-xs mt-1">
          Connected to Ubuntu 22.04 LTS container • Real-time session
        </div>
        <div className="text-terminal-blue text-xs">
          Type 'help' for available commands or 'clear' to clear the screen
        </div>
      </div>

      {/* Command History and Output */}
      <div className="space-y-1">
        {output.map((item) => (
          <div key={item.id} className="terminal-line">
            {item.type === "command" && (
              <div className="flex items-center flex-wrap mb-1">
                {renderPrompt(prompt.user, prompt.hostname, prompt.directory)}
                <span
                  className="text-terminal-white"
                  data-testid={`command-${item.id}`}
                >
                  {item.content}
                </span>
              </div>
            )}
            {item.type === "output" && (
              <div
                className={cn(
                  "text-terminal-white whitespace-pre-wrap text-xs",
                  item.exitCode && item.exitCode !== "0" && "text-terminal-red",
                )}
                data-testid={`output-${item.id}`}
              >
                {formatOutput(item.content)}
              </div>
            )}
            {item.type === "error" && (
              <div
                className="text-terminal-red whitespace-pre-wrap text-xs"
                data-testid={`error-${item.id}`}
              >
                {formatOutput(item.content)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current Command Line */}
      <div className="flex items-center flex-wrap mt-2">
        {renderPrompt(prompt.user, prompt.hostname, prompt.directory)}
        <span className="text-terminal-white" data-testid="current-command">
          {currentCommand}
        </span>
        <span
          className={cn(
            "bg-terminal-white w-2 h-4 inline-block ml-1",
            isLoading ? "animate-pulse" : "animate-pulse",
          )}
          style={{
            animation: isLoading ? "pulse 1s infinite" : "blink 1s infinite",
          }}
        />
      </div>

      {isLoading && (
        <div className="text-terminal-grey text-xs mt-2">
          Executing command...
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thumb-terminal-blue::-webkit-scrollbar-thumb {
          background-color: #58A6FF;
          border-radius: 3px;
        }
        .scrollbar-track-terminal-dark::-webkit-scrollbar-track {
          background: #21262D;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
      `}</style>
    </div>
  );
}
