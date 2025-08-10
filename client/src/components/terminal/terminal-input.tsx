import { useEffect, useRef } from 'react';

interface TerminalInputProps {
  currentCommand: string;
  onCommandChange: (command: string) => void;
  onCommandExecute: (command: string) => void;
  onHistoryNavigate: (direction: 'up' | 'down') => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function TerminalInput({
  currentCommand,
  onCommandChange,
  onCommandExecute,
  onHistoryNavigate,
  disabled = false,
  autoFocus = true,
}: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (currentCommand.trim() && !disabled) {
          onCommandExecute(currentCommand.trim());
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        onHistoryNavigate('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        onHistoryNavigate('down');
        break;
      case 'c':
        if (e.ctrlKey) {
          e.preventDefault();
          onCommandChange('');
        }
        break;
      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          // Could trigger clear terminal
        }
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCommandChange(e.target.value);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={currentCommand}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className="fixed -top-full opacity-0 pointer-events-none"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="none"
      spellCheck="false"
      data-testid="terminal-input"
    />
  );
}
