import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/axios';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  networkError: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  retryConnection: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

const checkAuth = async () => {
    try {
      console.log('Checking authentication status...');
      setNetworkError(false); // Clear any previous network errors
      const response = await api.get('/me');
      console.log('Auth check successful:', response.data);
      setUser(response.data.user);
    } catch (error: any) {
      // Handle different types of errors
      if (error.name === 'CORSError' || (axios.isAxiosError(error) && error.code === 'ERR_NETWORK')) {
        console.error('Network/CORS Error: Cannot connect to backend server.');
        console.error('Frontend:', window.location.origin);
        console.error('Backend:', import.meta.env.VITE_API_URL);
        setNetworkError(true);
      } else if (axios.isAxiosError(error)) {
        console.warn('Auth check failed:', `${error.response?.status} ${error.response?.data?.error || error.message}`);
        // Don't set network error for authentication failures
      } else {
        console.warn('Auth check failed:', error.message || error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const retryConnection = () => {
    setLoading(true);
    setNetworkError(false);
    checkAuth();
  };

const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login...');
      const response = await api.post('/login', {
        username: email,
        password
      });
      
      console.log('Login successful, user data:', response.data);
      
      if (!response.data.user) {
        console.error('Login response missing user data:', response.data);
        throw new Error('Invalid login response format');
      }
      
      setUser(response.data.user);
      
      // Immediately verify the session is working
      await checkAuth();
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

const logout = async () => {
    try {
      console.log('Logging out...');
      await api.get('/logout');
      console.log('Logout API call successful');
    } catch (error) {
      console.warn('Logout API call failed:', error);
      // Even if logout fails on server, clear local state
    } finally {
      setUser(null);
      console.log('User state cleared');
    }
  };

useEffect(() => {
    // On initial load, check authentication status
    console.log('AuthContext mounted, checking authentication...');
    checkAuth();
    
    // Set up an interval to periodically check auth status (every 30 minutes)
    const intervalId = setInterval(() => {
      console.log('Periodic auth check...');
      checkAuth();
    }, 30 * 60 * 1000); // Changed from 5 minutes to 30 minutes
    
    return () => clearInterval(intervalId);
  }, []);

  const value = {
    user,
    loading,
    networkError,
    login,
    logout,
    checkAuth,
    retryConnection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
