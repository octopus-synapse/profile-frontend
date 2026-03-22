'use client';

import { useCallback, useState } from 'react';
import { apiFetch, RESUMES_ROUTES } from '@profile/api-client';
import { useMutation } from '@tanstack/react-query';
import { Check, Copy, Loader2 } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Switch,
} from '@/shared/components/ui';
import { useCopyFeedback } from '@/shared/hooks/use-copy-feedback';
import { showToast } from '@/shared/components/ui/toast';

import { type ShareLink, buildFullUrl } from './share-utils';

// --- Types ---

interface CreateShareResponse {
  share: ShareLink;
}

// --- Hooks ---

function useCreateShareLink() {
  return useMutation({
    mutationFn: async (params: {
      resumeId: string;
      password?: string;
      expiresAt?: string;
    }) => {
      const result = await apiFetch.post<CreateShareResponse>(
        RESUMES_ROUTES.RESUMES_CREATE_SHARE,
        {
          resumeId: params.resumeId,
          password: params.password || undefined,
          expiresAt: params.expiresAt || undefined,
        },
      );
      return result.share;
    },
  });
}

// --- Sub-components ---

interface CreatedLinkViewProps {
  shareLink: ShareLink;
}

function CreatedLinkView({ shareLink }: CreatedLinkViewProps) {
  const { copied, copy } = useCopyFeedback();
  const fullUrl = buildFullUrl(shareLink.publicUrl);

  const handleCopy = useCallback(async () => {
    const success = await copy(fullUrl);
    if (success) {
      showToast.success('Link copied to clipboard');
    } else {
      showToast.error('Failed to copy link');
    }
  }, [fullUrl, copy]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-300">
        Your share link is ready:
      </p>
      <div className="flex items-center gap-2">
        <Input
          readOnly
          value={fullUrl}
          className="flex-1 text-xs"
          onClick={(e: React.MouseEvent<HTMLInputElement>) => (e.target as HTMLInputElement).select()}
        />
        <Button type="button" variant="outline" onClick={handleCopy}>
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      {shareLink.hasPassword && (
        <p className="text-xs text-neutral-500">
          🔒 Password protected
        </p>
      )}
      {shareLink.expiresAt && (
        <p className="text-xs text-neutral-500">
          Expires: {new Date(shareLink.expiresAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

// --- Main component ---

interface ShareLinkDialogProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function ShareLinkDialog({
  resumeId,
  open,
  onOpenChange,
  onCreated,
}: ShareLinkDialogProps) {
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [createdLink, setCreatedLink] = useState<ShareLink | null>(null);

  const createShare = useCreateShareLink();

  const resetForm = useCallback(() => {
    setUsePassword(false);
    setPassword('');
    setExpiresAt('');
    setCreatedLink(null);
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) resetForm();
      onOpenChange(nextOpen);
    },
    [onOpenChange, resetForm],
  );

  const handleCreate = useCallback(() => {
    createShare.mutate(
      {
        resumeId,
        password: usePassword ? password : undefined,
        expiresAt: expiresAt || undefined,
      },
      {
        onSuccess: (share) => {
          setCreatedLink(share);
          showToast.success('Share link created');
          onCreated?.();
        },
        onError: () => {
          showToast.error('Failed to create share link');
        },
      },
    );
  }, [resumeId, usePassword, password, expiresAt, createShare, onCreated]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Share Link</DialogTitle>
          <DialogDescription>
            Generate a link to share your resume publicly.
          </DialogDescription>
        </DialogHeader>

        {createdLink ? (
          <CreatedLinkView shareLink={createdLink} />
        ) : (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="use-password">Password protection</Label>
              <Switch
                id="use-password"
                checked={usePassword}
                onCheckedChange={setUsePassword}
              />
            </div>

            {usePassword && (
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            )}

            <div className="space-y-1.5">
              <Label htmlFor="expires-at">Expiry date (optional)</Label>
              <Input
                id="expires-at"
                type="date"
                value={expiresAt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExpiresAt(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {createdLink ? (
            <Button
              type="button"
              onClick={() => handleOpenChange(false)}
            >
              Done
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleCreate}
              disabled={createShare.isPending || (usePassword && !password)}
            >
              {createShare.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                'Create Link'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
