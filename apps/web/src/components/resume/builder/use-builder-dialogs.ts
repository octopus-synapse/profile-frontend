/**
 * useBuilderDialogs - UI state management for resume builder dialogs
 *
 * This is a pure UI hook (no data fetching). It manages which dialogs are open
 * and handles the section editor state.
 */

import { useCallback, useState } from 'react';

export type DialogId =
  | 'export'
  | 'import'
  | 'history'
  | 'share'
  | 'analytics'
  | 'ats'
  | 'sectionEditor'
  | 'reorder';

interface SectionEditorState {
  sectionTypeKey: string | null;
  title: string | null;
}

const INITIAL_DIALOGS: Record<DialogId, boolean> = {
  export: false,
  import: false,
  history: false,
  share: false,
  analytics: false,
  ats: false,
  sectionEditor: false,
  reorder: false,
};

export function useBuilderDialogs() {
  const [isOpen, setIsOpen] = useState<Record<DialogId, boolean>>(INITIAL_DIALOGS);
  const [sectionEditor, setSectionEditor] = useState<SectionEditorState>({
    sectionTypeKey: null,
    title: null,
  });

  const open = useCallback((id: DialogId) => {
    setIsOpen((prev) => ({ ...prev, [id]: true }));
  }, []);

  const close = useCallback((id: DialogId) => {
    setIsOpen((prev) => ({ ...prev, [id]: false }));
    if (id === 'sectionEditor') {
      setSectionEditor({ sectionTypeKey: null, title: null });
    }
  }, []);

  const toggle = useCallback(
    (id: DialogId, value: boolean) => {
      if (value) {
        open(id);
      } else {
        close(id);
      }
    },
    [open, close],
  );

  const openSectionEditor = useCallback((sectionTypeKey: string, title?: string) => {
    setSectionEditor({ sectionTypeKey, title: title ?? null });
    setIsOpen((prev) => ({ ...prev, sectionEditor: true }));
  }, []);

  return {
    isOpen,
    sectionEditor,
    open,
    close,
    toggle,
    openSectionEditor,
  };
}
