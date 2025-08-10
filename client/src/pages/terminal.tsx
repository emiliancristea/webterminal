import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTerminal } from '@/hooks/use-terminal';
import { useIsMobile } from '@/hooks/use-mobile';
import { TerminalOutput } from '@/components/terminal/terminal-output';
import { TerminalInput } from '@/components/terminal/terminal-input';
import { FileExplorer } from '@/components/terminal/file-explorer';
import { MobileToolbar } from '@/components/terminal/mobile-toolbar';
import { CommandBar } from '@/components/terminal/command-bar';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';
import type { Session } from '@shared/schema';

export default function TerminalPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const isMobile = useIsMobile();

  // Create or get existing session
  const { data: session, isLoading: sessionLoading } = useQuery<Session>({
    queryKey: ['/api/sessions/create'],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/sessions');
      return response.json();
    },
    staleTime: Infinity, // Keep session alive
  });

  useEffect(() => {
    if (session?.id) {
      setSessionId(session.id);
    }
  }, [session]);

  const terminal = useTerminal({
    sessionId: sessionId || '',
  });

  const handleToggleSidebar = useCallback(() => {
    setSidebarVisible(prev => !prev);
  }, []);

  const handleToggleKeyboard = useCallback(() => {
    setKeyboardVisible(prev => !prev);
    // Focus the terminal input to show virtual keyboard
    const input = document.querySelector('[data-testid="terminal-input"]') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }, []);

  const handleShowSettings = useCallback(() => {
    // TODO: Implement settings modal
    console.log('Show settings');
  }, []);

  const handleFocusTerminal = useCallback(() => {
    const input = document.querySelector('[data-testid="terminal-input"]') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }, []);

  const handleExecuteCommand = useCallback(() => {
    if (terminal.currentCommand.trim()) {
      terminal.executeCommand(terminal.currentCommand);
    }
  }, [terminal]);

  const handleClearCommand = useCallback(() => {
    terminal.setCurrentCommand('');
  }, [terminal]);

  const handleShowHistory = useCallback(() => {
    // TODO: Implement history modal
    console.log('Show command history');
  }, []);

  const handleQuickCommand = useCallback((command: string) => {
    terminal.setCurrentCommand(command);
    handleFocusTerminal();
  }, [terminal, handleFocusTerminal]);

  const handleCreateFile = useCallback(async (name: string) => {
    terminal.executeCommand(`touch ${name}`);
  }, [terminal]);

  const handleCreateFolder = useCallback(async (name: string) => {
    terminal.executeCommand(`mkdir ${name}`);
  }, [terminal]);

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      // Debounce resize events to avoid spam
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (terminal.handleResize) {
          const cols = Math.floor(window.innerWidth / 8); // Approximate character width
          const rows = Math.floor(window.innerHeight / 20); // Approximate line height
          terminal.handleResize(cols, rows);
        }
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [terminal]);

  if (sessionLoading || !sessionId) {
    return (
      <div className="h-screen bg-terminal-black flex items-center justify-center">
        <div className="text-terminal-white font-mono">
          <div className="animate-pulse">Initializing terminal session...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-terminal-black text-terminal-white font-mono overflow-hidden">
      {/* Mobile Toolbar */}
      {isMobile && !terminal.isInitializing && (
        <MobileToolbar
          onToggleSidebar={handleToggleSidebar}
          onToggleKeyboard={handleToggleKeyboard}
          onShowSettings={handleShowSettings}
          isConnected={terminal.isConnected}
          sessionId={sessionId}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - File Explorer */}
        <FileExplorer
          sessionId={sessionId}
          isVisible={!isMobile || sidebarVisible}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
        />

        {/* Main Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Desktop Terminal Tabs */}
          {!isMobile && (
            <div className="bg-terminal-dark border-b border-terminal-grey/20 px-4 py-2 flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-terminal-black px-3 py-1 rounded-t">
                <div className="w-2 h-2 bg-terminal-blue rounded-full" />
                <span className="text-xs">Terminal 1</span>
                <button className="text-terminal-grey hover:text-terminal-red ml-2">
                  ×
                </button>
              </div>
              <button className="text-terminal-blue hover:text-terminal-white">
                +
              </button>
            </div>
          )}

          {/* Terminal Output */}
          {terminal.isInitializing ? (
            <div className="flex-1 p-4 flex flex-col">
              <div className="text-terminal-blue font-mono">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-terminal-blue border-t-transparent rounded-full"></div>
                  <span>Session initializing...</span>
                </div>
                <div className="text-terminal-grey text-sm mt-2">
                  Connecting to Linux environment...
                </div>
              </div>
            </div>
          ) : (
            <TerminalOutput
              output={terminal.output}
              prompt={terminal.prompt}
              currentCommand={terminal.currentCommand}
              isLoading={terminal.isLoading}
              onFocus={handleFocusTerminal}
            />
          )}

          {/* Hidden Terminal Input */}
          <TerminalInput
            currentCommand={terminal.currentCommand}
            onCommandChange={terminal.setCurrentCommand}
            onCommandExecute={terminal.executeCommand}
            onHistoryNavigate={terminal.navigateHistory}
            disabled={terminal.isLoading || terminal.isInitializing}
            autoFocus={!isMobile && !terminal.isInitializing}
          />

          {/* Mobile Command Bar */}
          {isMobile && (
            <CommandBar
              onExecuteCommand={handleExecuteCommand}
              onClearCommand={handleClearCommand}
              onShowHistory={handleShowHistory}
              onQuickCommand={handleQuickCommand}
              currentCommand={terminal.currentCommand}
              disabled={terminal.isLoading}
            />
          )}
        </div>
      </div>

      {/* Desktop Status Bar */}
      {!isMobile && (
        <div className="bg-terminal-dark border-t border-terminal-grey/20 px-4 py-2 text-xs text-terminal-grey flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className={cn(
              terminal.isConnected ? "text-terminal-green" : "text-terminal-red"
            )}>
              {terminal.isConnected ? "Connected" : "Disconnected"}
            </span>
            <div className="flex items-center space-x-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                terminal.isConnected ? "bg-terminal-green" : "bg-terminal-red"
              )} />
              <span data-testid="text-session-time">Session: {sessionId.slice(0, 8)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span data-testid="text-current-directory">{terminal.prompt.directory}</span>
            <span data-testid="text-current-user">{terminal.prompt.user}@{terminal.prompt.hostname}</span>
            <span>UTF-8</span>
          </div>
        </div>
      )}
    </div>
  );
}
