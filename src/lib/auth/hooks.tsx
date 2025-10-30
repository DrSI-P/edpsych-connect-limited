import { useState, useEffect, useContext, createContext } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser, PasswordUpdateRequest } from './types';
import { secureStore, secureRetrieve, secureRemove } from '../../utils/encryption';
import { logger } from '../../utils/logger';


// Define authentication context type
interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (userData: any) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  completeReset: (token: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
  changePassword: (data: PasswordUpdateRequest) => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps your app and provides the auth context
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook for components to get access to the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider hook that creates the auth object and handles state
function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Effect for checking if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);

        // Check for stored tokens (securely encrypted)
        const storedToken = secureRetrieve('accessToken');
        if (!storedToken) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Verify token validity - this could be a lightweight API call
        // or JWT decoding to check expiry
        const userData = secureRetrieve('userData');

        // If we have stored user data, set it
        if (userData && userData.id) {
          setUser(userData);
        } else {
          // Token exists but no user data, try to refresh
          const success = await refreshToken();
          if (!success) {
            // If refresh fails, clear everything securely
            secureRemove('accessToken');
            secureRemove('refreshToken');
            secureRemove('userData');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Authentication check failed', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Log in a user with email and password
   */
  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        logger.error('Login failed:', data.message);
        return false;
      }

      // Store tokens and user data securely with encryption
      secureStore('accessToken', data.data.accessToken);
      secureStore('refreshToken', data.data.refreshToken);
      secureStore('userData', data.data.user);

      // Update state
      setUser(data.data.user);

      return true;
    } catch (error) {
      logger.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up a new user
   */
  const signup = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        logger.error('Signup failed:', data.message);
        return false;
      }

      // Store tokens and user data securely with encryption
      secureStore('accessToken', data.data.accessToken);
      secureStore('refreshToken', data.data.refreshToken);
      secureStore('userData', data.data.user);

      // Update state
      setUser(data.data.user);

      return true;
    } catch (error) {
      logger.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log out the current user
   */
  const logout = async (): Promise<void> => {
    try {
      // Clear tokens and user data securely
      secureRemove('accessToken');
      secureRemove('refreshToken');
      secureRemove('userData');

      // Update state
      setUser(null);

      // Redirect to login page
      router.push('/auth/signin');
    } catch (error) {
      logger.error('Logout error:', error);
    }
  };

  /**
   * Refresh the access token using the refresh token
   */
  const refreshToken = async (): Promise<boolean> => {
    try {
      const storedRefreshToken = secureRetrieve('refreshToken');

      if (!storedRefreshToken) {
        return false;
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        logger.error('Token refresh failed:', data.message);
        return false;
      }

      // Update tokens securely
      secureStore('accessToken', data.data.accessToken);
      secureStore('refreshToken', data.data.refreshToken);

      // Try to get user data
      const userData = secureRetrieve('userData');
      if (userData && userData.id) {
        setUser(userData);
      }

      return true;
    } catch (error) {
      logger.error('Token refresh error:', error);
      return false;
    }
  };

  /**
   * Request a password reset for an email
   */
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      return response.ok && data.success;
    } catch (error) {
      logger.error('Password reset request error:', error);
      return false;
    }
  };

  /**
   * Complete a password reset using a token
   */
  const completeReset = async (
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/password/reset', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      return response.ok && data.success;
    } catch (error) {
      logger.error('Password reset completion error:', error);
      return false;
    }
  };

  /**
   * Change password for authenticated user
   */
  const changePassword = async (data: PasswordUpdateRequest): Promise<boolean> => {
    try {
      const token = secureRetrieve('accessToken');

      const response = await fetch('/api/auth/password/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        // If requires re-authentication, log out
        if (responseData.requireReAuthentication) {
          await logout();
        }
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Password change error:', error);
      return false;
    }
  };

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    refreshToken,
    resetPassword,
    completeReset,
    changePassword,
    hasPermission,
    hasRole,
  };
}

/**
 * Higher-order component to protect routes requiring authentication
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: string,
  requiredRole?: string
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading, hasPermission, hasRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push('/auth/signin');
        return;
      }

      if (
        !isLoading &&
        user &&
        ((requiredPermission && !hasPermission(requiredPermission)) ||
          (requiredRole && !hasRole(requiredRole)))
      ) {
        router.push('/');
      }
    }, [user, isLoading, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return null;
    }

    if (
      (requiredPermission && !hasPermission(requiredPermission)) ||
      (requiredRole && !hasRole(requiredRole))
    ) {
      return <div>Access denied</div>;
    }

    return <Component {...props} />;
  };
}