import  { type createContext, useContext, useState, ReactNode } from 'react';


interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// The context itself — starts undefined, gets filled in by AuthProvider below
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This wraps your whole app (in main.tsx) so every page can access login state
export function AuthProvider({ children }: { children: ReactNode }) {
  // On first load, check if a token already exists in localStorage
  // (e.g. user refreshed the page but was already logged in)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem('token')
  );

  function login(token: string) {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so pages can just call useAuth() instead of importing useContext + AuthContext every time
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}