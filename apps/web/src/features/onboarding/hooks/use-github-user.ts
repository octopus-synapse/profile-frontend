"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/shared/hooks/use-debounce";

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  html_url: string;
}

interface UseGitHubUserResult {
  user: GitHubUser | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch GitHub user by username
 * Uses GitHub's public API: https://api.github.com/users/{username}
 */
export function useGitHubUser(username: string | null): UseGitHubUserResult {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce username to avoid too many requests
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    // Reset state when username is cleared
    if (!debouncedUsername || debouncedUsername.trim() === "") {
      setUser(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    // Validate username format (GitHub usernames: alphanumeric and hyphens, 1-39 chars)
    const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    const cleanUsername = debouncedUsername.trim().toLowerCase();

    if (!usernameRegex.test(cleanUsername) || cleanUsername.length > 39) {
      setUser(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    // Fetch user from GitHub API
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://api.github.com/users/${cleanUsername}`, {
          method: "GET",
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (response.status === 404) {
          setUser(null);
          setError("Usuário não encontrado");
          setIsLoading(false);
          return;
        }

        if (response.status === 403) {
          // Rate limit exceeded
          setUser(null);
          setError("Muitas requisições. Aguarde um momento.");
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        setUser({
          login: data.login,
          avatar_url: data.avatar_url,
          name: data.name,
          html_url: data.html_url,
        });
        setError(null);
      } catch (err) {
        setUser(null);
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao buscar usuário. Tente novamente."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [debouncedUsername]);

  return { user, isLoading, error };
}

