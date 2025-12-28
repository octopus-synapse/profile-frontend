"use client";

/**
 * Autocomplete Component
 * A searchable combobox with async data loading
 */

import * as React from "react";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

export interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
}

export interface AutocompleteProps {
  /** Current selected value */
  value?: string;
  /** Display label for current value (when value is set externally) */
  displayValue?: string;
  /** Called when selection changes */
  onValueChange?: (value: string, option?: AutocompleteOption) => void;
  /** Called when search query changes */
  onSearch?: (query: string) => void;
  /** Options to display */
  options?: AutocompleteOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Additional class names */
  className?: string;
  /** Minimum characters to trigger search */
  minSearchLength?: number;
  /** Allow clearing the selection */
  clearable?: boolean;
}

export function Autocomplete({
  value,
  displayValue,
  onValueChange,
  onSearch,
  options = [],
  placeholder = "Selecione...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum resultado encontrado",
  isLoading = false,
  disabled = false,
  error = false,
  className,
  minSearchLength = 2,
  clearable = true,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = displayValue || selectedOption?.label;

  // Debounced search
  React.useEffect(() => {
    if (search.length >= minSearchLength) {
      const timeoutId = setTimeout(() => {
        onSearch?.(search);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [search, minSearchLength, onSearch]);

  // Focus input when popover opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleSelect = (option: AutocompleteOption) => {
    onValueChange?.(option.value, option);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.("", undefined);
    setSearch("");
  };

  const listboxId = React.useId();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm",
            "bg-pf-canvas-default border-pf-border-default border",
            "text-pf-fg-default",
            "ring-offset-pf-canvas-default",
            "focus:ring-pf-accent-emphasis focus:ring-2 focus:ring-offset-2 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-pf-danger-emphasis",
            className
          )}
        >
          <span className={cn("flex-1 truncate", !displayText && "text-pf-fg-subtle")}>
            {displayText || placeholder}
          </span>
          <div className="ml-2 flex items-center gap-1">
            {clearable && value && !disabled && (
              <X
                className="h-4 w-4 cursor-pointer opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "z-50 w-[--radix-popover-trigger-width] overflow-hidden rounded-lg p-0",
          "bg-pf-canvas-overlay border-pf-border-default border shadow-lg",
          "animate-in fade-in-0 zoom-in-95"
        )}
        align="start"
        sideOffset={4}
      >
        {/* Search Input */}
        <div className="border-pf-border-default flex items-center border-b px-3">
          <Search className="text-pf-fg-muted mr-2 h-4 w-4" />
          <input
            ref={inputRef}
            type="text"
            className={cn(
              "flex h-10 w-full bg-transparent py-3 text-sm outline-none",
              "placeholder:text-pf-fg-subtle text-pf-fg-default"
            )}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isLoading && <Loader2 className="text-pf-fg-muted h-4 w-4 animate-spin" />}
        </div>

        {/* Options List */}
        <div id={listboxId} role="listbox" className="max-h-[300px] overflow-y-auto p-1">
          {search.length < minSearchLength ? (
            <div className="text-pf-fg-muted py-6 text-center text-sm">
              Digite pelo menos {minSearchLength} caracteres para buscar
            </div>
          ) : isLoading ? (
            <div className="text-pf-fg-muted py-6 text-center text-sm">Buscando...</div>
          ) : options.length === 0 ? (
            <div className="text-pf-fg-muted py-6 text-center text-sm">{emptyMessage}</div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "relative flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm outline-none select-none",
                  "hover:bg-pf-canvas-subtle",
                  value === option.value && "bg-pf-accent-subtle"
                )}
                onClick={() => handleSelect(option)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 flex-shrink-0",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="truncate font-medium">{option.label}</span>
                  {option.description && (
                    <span className="text-pf-fg-muted truncate text-xs">{option.description}</span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

Autocomplete.displayName = "Autocomplete";
