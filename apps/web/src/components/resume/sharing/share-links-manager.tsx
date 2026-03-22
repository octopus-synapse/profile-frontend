'use client';

import { useCallback } from 'react';
import { apiFetch } from '@profile/api-client';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Check,
  Copy,
  ExternalLink,
  Lock,
  Share2,
  Trash2,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/shared/components/ui';
import { useCopyFeedback } from '@/shared/hooks/use-copy-feedback';
import { showToast } from '@/shared/components/ui/toast';

import { type ShareLink, buildFullUrl } from './share-utils';

// --- Types ---

interface ShareListResponse {
  shares: ShareLink[];
}

// --- Query keys ---

export const shareLinkKeys = {
  all: ['share-links'] as const,
  byResume: (resumeId: string) =>
    [...shareLinkKeys.all, resumeId] as const,
};

// --- Hooks ---

function useShareLinks(resumeId: string) {
  return useQuery({
    queryKey: shareLinkKeys.byResume(resumeId),
    queryFn: async () => {
      const result = await apiFetch.get<ShareListResponse>(
        `/api/v1/shares/resume/${resumeId}`,
      );
      return result.shares;
    },
    enabled: !!resumeId,
    staleTime: 15_000,
  });
}

function useDeleteShareLink(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shareId: string) => {
      await apiFetch.delete(`/api/v1/shares/${shareId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shareLinkKeys.byResume(resumeId),
      });
      showToast.success('Share link deleted');
    },
    onError: () => {
      showToast.error('Failed to delete share link');
    },
  });
}

// --- Sub-components ---

function ShareLinkSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-neutral-800 p-3">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  );
}

function EmptyShareLinks() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Share2 className="mb-3 h-10 w-10 text-neutral-400" />
      <p className="text-sm font-medium text-neutral-300">
        No share links
      </p>
      <p className="mt-1 text-xs text-neutral-500">
        Create a share link to share your resume publicly
      </p>
    </div>
  );
}

interface ShareLinkItemProps {
  share: ShareLink;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function ShareLinkItem({ share, onDelete, isDeleting }: ShareLinkItemProps) {
  const { copied, copy } = useCopyFeedback();
  const fullUrl = buildFullUrl(share.publicUrl);

  const isExpired =
    share.expiresAt !== null && new Date(share.expiresAt) < new Date();

  const handleCopy = useCallback(async () => {
    const success = await copy(fullUrl);
    if (success) {
      showToast.success('Link copied');
    } else {
      showToast.error('Failed to copy');
    }
  }, [fullUrl, copy]);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-neutral-800 p-3">
      <ExternalLink className="h-5 w-5 shrink-0 text-neutral-400" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-200">
          {fullUrl}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {share.hasPassword && (
            <Badge variant="outline" className="gap-1 text-xs">
              <Lock className="h-3 w-3" /> Password
            </Badge>
          )}
          {isExpired ? (
            <Badge variant="destructive" className="text-xs">
              Expired
            </Badge>
          ) : share.expiresAt ? (
            <span className="text-xs text-neutral-500">
              Expires {new Date(share.expiresAt).toLocaleDateString()}
            </span>
          ) : null}
          <span className="text-xs text-neutral-500">
            Created {new Date(share.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          title="Copy link"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(share.id)}
          disabled={isDeleting}
          title="Delete share link"
        >
          <Trash2 className="h-4 w-4 text-red-400" />
        </Button>
      </div>
    </div>
  );
}

// --- Main component ---

interface ShareLinksManagerProps {
  resumeId: string;
}

export function ShareLinksManager({ resumeId }: ShareLinksManagerProps) {
  const { data: shares, isLoading } = useShareLinks(resumeId);
  const deleteShare = useDeleteShareLink(resumeId);

  const handleDelete = useCallback(
    (shareId: string) => {
      deleteShare.mutate(shareId);
    },
    [deleteShare],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Share Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <>
            <ShareLinkSkeleton />
            <ShareLinkSkeleton />
          </>
        ) : !shares?.length ? (
          <EmptyShareLinks />
        ) : (
          shares.map((share) => (
            <ShareLinkItem
              key={share.id}
              share={share}
              onDelete={handleDelete}
              isDeleting={deleteShare.isPending}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
