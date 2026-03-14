'use client';

import { useEffect, useState } from 'react';

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
}

interface UseGitHubUserResult {
  user: GitHubUser | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and validate a GitHub username
 * Uses the public GitHub API - no authentication required for basic info
 */
export function useGitHubUser(username: string | null): UseGitHubUserResult {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when username changes
    if (!username || username.trim() === '') {
      setUser(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout>;

    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username.trim())}`,
          {
            signal: controller.signal,
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          },
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError('GitHub user not found');
          } else if (response.status === 403) {
            // Rate limited - don't show as error, just clear
            setError(null);
          } else {
            setError('Failed to verify GitHub user');
          }
          setUser(null);
          return;
        }

        const data = (await response.json()) as GitHubUser;
        setUser(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return; // Ignore abort errors
        }
        setError('Failed to verify GitHub user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the fetch
    timeoutId = setTimeout(() => {
      void fetchUser();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [username]);

  return { user, isLoading, error };
}
