import { useState } from 'react';
import { Menu, Keyboard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileToolbarProps {
  onToggleSidebar: () => void;
  onToggleKeyboard: () => void;
  onShowSettings: () => void;
  isConnected: boolean;
  sessionId: string;
}

export function MobileToolbar({
  onToggleSidebar,
  onToggleKeyboard,
  onShowSettings,
  isConnected,
  sessionId
}: MobileToolbarProps) {
  return (
    <div className="bg-terminal-dark border-b border-terminal-grey/20 px-4 py-2 flex items-center justify-between md:hidden">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="text-terminal-blue hover:text-terminal-white transition-colors"
          data-testid="button-toggle-sidebar"
        >
          <Menu size={18} />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            isConnected ? "bg-terminal-green" : "bg-terminal-red"
          )} />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-terminal-green rounded-full" />
        </div>
        
        <span className="text-terminal-grey text-xs" data-testid="text-session-info">
          user@webterminal • {sessionId.slice(0, 8)}
        </span>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleKeyboard}
          className="text-terminal-blue hover:text-terminal-white transition-colors"
          data-testid="button-toggle-keyboard"
        >
          <Keyboard size={18} />
        </button>
        
        <button
          onClick={onShowSettings}
          className="text-terminal-blue hover:text-terminal-white transition-colors"
          data-testid="button-show-settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}
