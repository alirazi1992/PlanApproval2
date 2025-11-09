import React, { useEffect, useState, createContext, useContext } from 'react';
interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    avatar: string;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      setUser({
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: 'https://i.pravatar.cc/150?img=5'
      });
    }
  }, []);
  const login = async (email: string, password: string) => {
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.setItem('auth', 'true');
    setIsAuthenticated(true);
    setUser({
      name: 'Sarah Johnson',
      email,
      avatar: 'https://i.pravatar.cc/150?img=5'
    });
  };
  const logout = () => {
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
    setUser(null);
  };
  return <AuthContext.Provider value={{
    isAuthenticated,
    user,
    login,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}