/**
 * Generic CRUD Form Hook
 * Manages form state and handlers for CRUD operations
 */

"use client";

import { useState } from "react";

/**
 * Creates a reusable form state manager for CRUD operations
 *
 * @param emptyValue - The empty/initial value for the form
 * @returns Form state and handlers
 *
 * @example
 * ```ts
 * const form = useCrudForm({ name: "", category: "" });
 * form.handleStartAdd();
 * form.setFormData({ name: "Test" });
 * ```
 */
export function useCrudForm<T>(emptyValue: T) {
  const [formData, setFormData] = useState<T>(emptyValue);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleStartAdd = () => {
    setFormData(emptyValue);
    setEditingId(null);
    setIsAdding(true);
  };

  const handleStartEdit = (item: T & { id: string }) => {
    setFormData(item);
    setEditingId(item.id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setFormData(emptyValue);
    setEditingId(null);
    setIsAdding(false);
  };

  const isFormOpen = isAdding || editingId !== null;

  return {
    formData,
    setFormData,
    editingId,
    isAdding,
    isFormOpen,
    handleStartAdd,
    handleStartEdit,
    handleCancel,
  };
}
