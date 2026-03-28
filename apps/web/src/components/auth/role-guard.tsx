'use client';

/**
 * Role Guard Component
 * Conditionally renders content based on user role
 * Uses Strategy Pattern for role checking
 */

import {
  type SessionUserResponseDtoRole,
  selectEnvelopeData,
  useAuthSession,
} from '@profile/api-client';
import type { ReactNode } from 'react';
import { Spinner } from '@/shared/components/ui';

// ============================================================================
// Strategy Pattern: Role Check Strategies
// ============================================================================

type RoleCheckStrategy = (
  userRole: SessionUserResponseDtoRole | undefined,
  requiredRoles: SessionUserResponseDtoRole[],
) => boolean;

const roleStrategies: Record<string, RoleCheckStrategy> = {
  // User has exact role
  exact: (userRole, requiredRoles) => {
    return requiredRoles.length === 1 && userRole === requiredRoles[0];
  },

  // User has any of the required roles
  any: (userRole, requiredRoles) => {
    return requiredRoles.some((role) => role === userRole);
  },

  // User has all required roles (for future multi-role support)
  all: (userRole, requiredRoles) => {
    return requiredRoles.every((role) => role === userRole);
  },
};

// ============================================================================
// Component Props
// ============================================================================

interface RoleGuardProps {
  children: ReactNode;
  roles: SessionUserResponseDtoRole[];
  strategy?: 'exact' | 'any' | 'all';
  fallback?: ReactNode;
  loading?: ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export function RoleGuard({
  children,
  roles,
  strategy = 'any',
  fallback = null,
  loading,
}: RoleGuardProps) {
  const { data, isLoading } = useAuthSession({ query: { select: selectEnvelopeData } });
  const user = data?.user;

  // Show loading state
  if (isLoading) {
    return (
      loading ?? (
        <div className="flex items-center justify-center p-8">
          <Spinner size="md" />
        </div>
      )
    );
  }

  // Check role using selected strategy
  const checkRole = roleStrategies[strategy];
  const hasAccess = checkRole?.(user?.role, roles) ?? false;

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// ============================================================================
// Convenience Components
// ============================================================================

interface AdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminOnly({ children, fallback }: AdminOnlyProps) {
  return (
    <RoleGuard roles={['ADMIN']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

interface AuthenticatedOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthenticatedOnly({ children, fallback }: AuthenticatedOnlyProps) {
  const { data, isLoading } = useAuthSession({ query: { select: selectEnvelopeData } });
  const isAuthenticated = data?.authenticated ?? false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
