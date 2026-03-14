'use client';

import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/shared/utils';
import { DEMO_COMMANDS, DEMO_HINT_TEXT, type DemoCommand } from './config/demo-commands';

interface DemoCommandPaletteProps {
  onSelectCommand: (command: DemoCommand) => void;
  selectedCommandId: string | null;
}

export function DemoCommandPalette({
  onSelectCommand,
  selectedCommandId,
}: DemoCommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return DEMO_COMMANDS;

    const lowerQuery = query.toLowerCase();
    return DEMO_COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lowerQuery) ||
        cmd.description.toLowerCase().includes(lowerQuery) ||
        cmd.keywords.some((k) => k.toLowerCase().includes(lowerQuery)),
    );
  }, [query]);

  const handleSelect = useCallback(
    (command: DemoCommand) => {
      onSelectCommand(command);
    },
    [onSelectCommand],
  );

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setSelectedIndex(0);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => (i < filteredCommands.length - 1 ? i + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => (i > 0 ? i - 1 : filteredCommands.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            handleSelect(filteredCommands[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, selectedIndex, handleSelect]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <Search className="h-5 w-5 shrink-0 text-zinc-500" strokeWidth={1.5} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={DEMO_HINT_TEXT}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          aria-label="Search demo commands"
        />
      </div>

      {/* Commands List */}
      <div className="max-h-[300px] overflow-y-auto py-2">
        {filteredCommands.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-zinc-500">No commands found</p>
        ) : (
          <div className="space-y-1 px-2">
            {filteredCommands.map((command, index) => {
              const Icon = command.icon;
              const isSelected = index === selectedIndex;
              const isActive = command.id === selectedCommandId;

              return (
                <button
                  type="button"
                  key={command.id}
                  onClick={() => handleSelect(command)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all',
                    isSelected && 'bg-white/10',
                    isActive && 'ring-1 ring-cyan-500/50',
                    !isSelected && !isActive && 'hover:bg-white/5',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                      isSelected || isActive
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-white/5 text-zinc-400',
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium truncate',
                        isSelected || isActive ? 'text-white' : 'text-zinc-300',
                      )}
                    >
                      {command.label}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{command.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
