
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session,  useSession,  useSupabaseClient } from '@supabase/auth-helpers-react';
import * as authService from '../services/authService';
import type { AuthenticationError } from '../services/authService';

interface AuthContextType {
  user: Session | null;
  loading: boolean;
  error: AuthenticationError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthenticationError | null>(null);
  const supabase = useSupabaseClient();
  const session = useSession();

  useEffect(() => {
    setUser(session);
    setLoading(false);
  }, [session]);

  const signIn = async (email: string, password: string) => {
    try {
      const sessionData = await authService.signIn(email, password);
      setUser(sessionData);
    } catch (err) {
      setError(err as AuthenticationError);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (err) {
      setError(err as AuthenticationError);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      signIn,
      signOut,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
</boltArtifact>
