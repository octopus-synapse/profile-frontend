/**
 * Generic CRUD Section Component
 * Reusable component for managing lists with create, read, update, delete operations
 */

"use client";

import { ReactNode } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LoadingSpinner } from "./ui/loading-spinner";
import { EmptyState } from "./ui/empty-state";
import { useCrudForm } from "../hooks/use-crud-form";
import { confirmDelete } from "../utils/form-helpers";

interface CrudSectionProps<TItem extends { id: string }, TFormData> {
  // Configuration
  title: string;
  emptyIcon: LucideIcon;
  emptyMessage: string;
  emptyActionLabel: string;
  addButtonLabel: string;
  itemName: string; // For confirmation messages (e.g., "skill", "education entry")

  // Data
  items: TItem[];
  isLoading: boolean;
  emptyFormData: TFormData;

  // Mutations
  createMutation: {
    mutateAsync: (data: any) => Promise<TItem>;
    isPending: boolean;
  };
  updateMutation: {
    mutateAsync: (params: { id: string; data: any }) => Promise<TItem>;
    isPending: boolean;
  };
  deleteMutation: {
    mutateAsync: (id: string) => Promise<void>;
    isPending: boolean;
  };

  // Render props
  renderItem: (item: TItem, onEdit: () => void, onDelete: () => void) => ReactNode;
  renderForm: (
    formData: TFormData,
    setFormData: (updater: TFormData | ((prev: TFormData) => TFormData)) => void,
    isEditing: boolean
  ) => ReactNode;

  // Data transformation
  prepareFormData: (item: TItem) => TFormData;
  preparePayload: (formData: TFormData) => any;
  validateForm: (formData: TFormData) => boolean;

  // Optional customization
  className?: string;
  itemsContainerClassName?: string;
}

export function CrudSection<TItem extends { id: string }, TFormData>({
  title,
  emptyIcon,
  emptyMessage,
  emptyActionLabel,
  addButtonLabel,
  itemName,
  items,
  isLoading,
  emptyFormData,
  createMutation,
  updateMutation,
  deleteMutation,
  renderItem,
  renderForm,
  prepareFormData,
  preparePayload,
  validateForm,
  className = "",
  itemsContainerClassName = "space-y-3",
}: CrudSectionProps<TItem, TFormData>) {
  const form = useCrudForm<TFormData>(emptyFormData);

  const handleStartAdd = () => {
    form.handleStartAdd();
  };

  const handleStartEdit = (item: TItem) => {
    const formData = prepareFormData(item);
    form.setFormData(formData);
    form.handleStartEdit(item as any);
  };

  const handleCancel = () => {
    form.handleCancel();
  };

  const handleSave = async () => {
    if (!validateForm(form.formData)) return;

    const payload = preparePayload(form.formData);

    try {
      if (form.editingId) {
        await updateMutation.mutateAsync({ id: form.editingId, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      handleCancel();
    } catch (error) {
      console.error(`Failed to save ${itemName}:`, error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirmDelete(itemName)) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error(`Failed to delete ${itemName}:`, error);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {items.length} {items.length === 1 ? itemName : `${itemName}s`} added
          </p>
        </div>
        {!form.isFormOpen && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            {addButtonLabel}
          </button>
        )}
      </div>

      {/* Items List */}
      {items.length > 0 && !form.isFormOpen && (
        <div className={itemsContainerClassName}>
          {items.map((item) =>
            renderItem(
              item,
              () => handleStartEdit(item),
              () => handleDelete(item.id)
            )
          )}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && !form.isFormOpen && (
        <EmptyState
          icon={emptyIcon}
          message={emptyMessage}
          actionLabel={emptyActionLabel}
          onAction={handleStartAdd}
          variant="dashed"
        />
      )}

      {/* Add/Edit Form */}
      {form.isFormOpen && (
        <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">
              {form.editingId ? `Edit ${itemName}` : `New ${itemName}`}
            </h3>
            <button
              onClick={handleCancel}
              className="rounded-lg p-1 text-zinc-400 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          {renderForm(form.formData, form.setFormData, !!form.editingId)}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!validateForm(form.formData) || isSaving}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {form.editingId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Utility wrapper for rendering item actions (Edit/Delete buttons)
 */
export function ItemActions({
  onEdit,
  onDelete,
  isDeleting = false,
}: {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}) {
  return (
    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
      <button
        onClick={onEdit}
        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-[#0A0A0A]/80 hover:text-white"
        title="Edit"
      >
        <Pencil className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-[#0A0A0A]/80 hover:text-red-500 disabled:opacity-50"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
