import { useState } from 'react';
import { Play, RotateCcw, History } from 'lucide-react';

interface CommandBarProps {
  onExecuteCommand: () => void;
  onClearCommand: () => void;
  onShowHistory: () => void;
  onQuickCommand: (command: string) => void;
  currentCommand: string;
  disabled?: boolean;
}

const BASIC_COMMANDS = [
  'ls',
  'pwd',
  'cd',
  'mkdir',
  'touch',
  'cat',
  'clear'
];

const NODE_COMMANDS = [
  'node --version',
  'npm --version', 
  'npm init',
  'npm install',
  'node hello.js',
  'npm start'
];

const CLAUDE_COMMANDS = [
  'npm install -g @anthropic-ai/claude-code',
  'claude doctor',
  'claude',
  'cd sample-project',
  'cat claude-setup.md',
  'npm run claude'
];

const DEV_COMMANDS = [
  'git status',
  'git init',
  'git clone',
  'curl',
  'nano',
  'cp package.json.template package.json'
];

export function CommandBar({
  onExecuteCommand,
  onClearCommand,
  onShowHistory,
  onQuickCommand,
  currentCommand,
  disabled = false
}: CommandBarProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'node' | 'claude' | 'dev'>('basic');
  
  const getActiveCommands = () => {
    switch (activeTab) {
      case 'node':
        return NODE_COMMANDS;
      case 'claude':
        return CLAUDE_COMMANDS;
      case 'dev':
        return DEV_COMMANDS;
      default:
        return BASIC_COMMANDS;
    }
  };

  return (
    <div className="bg-terminal-dark border-t border-terminal-grey/20 p-3 md:hidden">
      <div className="flex items-center space-x-3 mb-3">
        <button
          onClick={onExecuteCommand}
          disabled={disabled || !currentCommand.trim()}
          className="bg-terminal-blue hover:bg-terminal-blue/80 disabled:bg-terminal-grey/30 disabled:cursor-not-allowed text-terminal-black px-3 py-1 rounded text-xs transition-colors"
          data-testid="button-execute-command"
        >
          <Play size={12} className="mr-1 inline" />
          Run
        </button>
        
        <button
          onClick={onClearCommand}
          className="bg-terminal-grey/30 hover:bg-terminal-grey/50 text-terminal-white px-3 py-1 rounded text-xs transition-colors"
          data-testid="button-clear-command"
        >
          <RotateCcw size={12} className="mr-1 inline" />
          Clear
        </button>
        
        <button
          onClick={onShowHistory}
          className="bg-terminal-grey/30 hover:bg-terminal-grey/50 text-terminal-white px-3 py-1 rounded text-xs transition-colors"
          data-testid="button-show-history"
        >
          <History size={12} className="mr-1 inline" />
          History
        </button>
      </div>
      
      {/* Command Tabs */}
      <div className="flex items-center space-x-1 mb-3 border-b border-terminal-grey/20 pb-2">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            activeTab === 'basic' 
              ? 'bg-terminal-blue text-terminal-black' 
              : 'bg-terminal-grey/30 text-terminal-white hover:bg-terminal-grey/50'
          }`}
          data-testid="tab-basic-commands"
        >
          Basic
        </button>
        <button
          onClick={() => setActiveTab('node')}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            activeTab === 'node' 
              ? 'bg-terminal-green text-terminal-black' 
              : 'bg-terminal-grey/30 text-terminal-white hover:bg-terminal-grey/50'
          }`}
          data-testid="tab-node-commands"
        >
          Node.js
        </button>
        <button
          onClick={() => setActiveTab('claude')}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            activeTab === 'claude' 
              ? 'bg-purple-500 text-white' 
              : 'bg-terminal-grey/30 text-terminal-white hover:bg-terminal-grey/50'
          }`}
          data-testid="tab-claude-commands"
        >
          Claude
        </button>
        <button
          onClick={() => setActiveTab('dev')}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            activeTab === 'dev' 
              ? 'bg-terminal-yellow text-terminal-black' 
              : 'bg-terminal-grey/30 text-terminal-white hover:bg-terminal-grey/50'
          }`}
          data-testid="tab-dev-commands"
        >
          Dev Tools
        </button>
      </div>
      
      {/* Quick Command Buttons */}
      <div className="flex flex-wrap gap-2">
        {getActiveCommands().map((command) => (
          <button
            key={command}
            onClick={() => onQuickCommand(command)}
            disabled={disabled}
            className="bg-terminal-dark hover:bg-terminal-black border border-terminal-grey/30 hover:border-terminal-blue/50 disabled:cursor-not-allowed text-terminal-white px-2 py-1 rounded text-xs transition-colors"
            data-testid={`button-quick-${command.replace(/\s/g, '-')}`}
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}
