'use client';

/**
 * Tooltip Component
 * Tooltip built on Radix UI Tooltip primitive
 */

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';
import { cn } from '@/shared/utils/cn';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm',
      'border border-pf-border-default bg-pf-canvas-subtle/95 shadow-md',
      'text-pf-fg-default',
      'animate-in fade-in-0 zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Simplified tooltip for common use
interface SimpleTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
}

function SimpleTooltip({
  content,
  children,
  side = 'top',
  delayDuration = 200,
}: SimpleTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * HelpTooltip - Question mark icon with tooltip
 * Use for inline help on form fields
 * Nielsen #10: Help and documentation
 */
interface HelpTooltipProps {
  content: React.ReactNode;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

function HelpTooltip({ content, className, side = 'top' }: HelpTooltipProps) {
  return (
    <SimpleTooltip content={content} side={side}>
      <button
        type="button"
        className={cn(
          'inline-flex h-4 w-4 items-center justify-center rounded-full',
          'bg-pf-hover-default text-pf-fg-muted',
          'hover:bg-pf-hover-default hover:text-pf-fg-default text-xs font-medium',
          'focus:ring-2 focus:ring-pf-accent-muted focus:outline-none transition-colors',
          className,
        )}
        aria-label="Help"
      >
        ?
      </button>
    </SimpleTooltip>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, SimpleTooltip, HelpTooltip };
