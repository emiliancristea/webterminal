import { useState, useCallback, useRef, useEffect } from 'react';
import { useWebSocket } from './use-websocket';

interface TerminalOutput {
  id: string;
  type: 'command' | 'output' | 'error';
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
  const [output, setOutput] = useState<TerminalOutput[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [prompt, setPrompt] = useState<PromptInfo>({
    user: 'user',
    hostname: 'webterminal',
    directory: '~'
  });

  const outputIdCounter = useRef(0);

  const addOutput = useCallback((type: TerminalOutput['type'], content: string, exitCode?: string) => {
    const newOutput: TerminalOutput = {
      id: `output-${++outputIdCounter.current}`,
      type,
      content,
      timestamp: new Date(),
      exitCode,
    };
    setOutput(prev => [...prev, newOutput]);
  }, []);

  const sendMessageRef = useRef<((message: any) => boolean) | null>(null);

  const handleConnect = useCallback(() => {
    // Initialize session when connected, but only if we have a valid sessionId
    if (sendMessageRef.current && sessionId) {
      sendMessageRef.current({
        type: 'init',
        data: { sessionId }
      });
    }
  }, [sessionId]);

  const handleMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'connected':
        console.log('WebSocket connected:', message.data);
        break;
      case 'output':
        addOutput('output', message.data.output, message.data.exitCode);
        setIsLoading(false);
        setIsInitializing(false); // Terminal is ready once we get output
        break;
      case 'error':
        // Filter out session initialization errors that resolve automatically
        if (message.data && !message.data.includes('Session not found')) {
          addOutput('error', message.data);
        }
        setIsLoading(false);
        break;
      case 'prompt':
        setPrompt(message.data);
        setIsInitializing(false); // Terminal is ready once we get a prompt
        break;
      case 'resize_ack':
        // Acknowledge resize - no action needed
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }, [addOutput]);

  const handleError = useCallback(() => {
    addOutput('error', 'Connection error occurred');
    setIsLoading(false);
  }, [addOutput]);

  const { isConnected, sendMessage } = useWebSocket('/ws', {
    onConnect: handleConnect,
    onMessage: handleMessage,
    onError: handleError,
  });

  // Update sendMessage ref when it changes
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  const executeCommand = useCallback((command: string) => {
    if (!command.trim()) return;

    // Add command to output
    addOutput('command', command);
    
    // Add to history
    setCommandHistory(prev => {
      const newHistory = [...prev, command];
      return newHistory.slice(-100); // Keep last 100 commands
    });
    
    setHistoryIndex(-1);
    setCurrentCommand('');
    setIsLoading(true);

    // Send command to server
    if (isConnected) {
      sendMessage({
        type: 'command',
        data: { command }
      });
    } else {
      addOutput('error', 'Not connected to server');
      setIsLoading(false);
    }
  }, [isConnected, sendMessage, addOutput]);

  const clearTerminal = useCallback(() => {
    setOutput([]);
  }, []);

  const navigateHistory = useCallback((direction: 'up' | 'down') => {
    if (commandHistory.length === 0) return;

    if (direction === 'up') {
      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setCurrentCommand(commandHistory[newIndex]);
    } else {
      if (historyIndex === -1) return;
      
      const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
      if (newIndex === commandHistory.length - 1 && historyIndex === newIndex) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      } else {
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    }
  }, [commandHistory, historyIndex]);

  const lastResizeRef = useRef<{ cols: number; rows: number } | null>(null);
  
  const handleResize = useCallback((cols: number, rows: number) => {
    // Only send if dimensions actually changed
    if (isConnected && sendMessage && 
        (!lastResizeRef.current || 
         lastResizeRef.current.cols !== cols || 
         lastResizeRef.current.rows !== rows)) {
      lastResizeRef.current = { cols, rows };
      sendMessage({
        type: 'resize',
        data: { cols, rows }
      });
    }
  }, [isConnected, sendMessage]);

  return {
    output,
    currentCommand,
    setCurrentCommand,
    prompt,
    isConnected,
    isLoading,
    isInitializing,
    executeCommand,
    clearTerminal,
    navigateHistory,
    handleResize,
  };
}
