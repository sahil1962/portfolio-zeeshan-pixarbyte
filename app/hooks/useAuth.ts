import { useState, useEffect, useCallback } from 'react';

interface AuthState {
  authenticated: boolean;
  email?: string;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: false,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();

        if (isMounted) {
          setAuthState({
            authenticated: data.authenticated,
            email: data.email,
            loading: false,
          });
        }
      } catch {
        if (isMounted) {
          setAuthState({
            authenticated: false,
            loading: false,
          });
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();

      setAuthState({
        authenticated: data.authenticated,
        email: data.email,
        loading: false,
      });
    } catch {
      setAuthState({
        authenticated: false,
        loading: false,
      });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAuthState({
        authenticated: false,
        loading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return { ...authState, logout, checkAuth };
}
