import React, { createContext, useContext, useState, useCallback } from 'react';

interface UserProfile {
  letter: string;
  color: string;
  metrics: {
    focus: number;
    skill: number;
    revision: number;
    attitude: number;
    potential: number;
  };
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generateRandomColor = () => {
  const colors = [
    'hsl(175, 75%, 25%)', // Teal
    'hsl(14, 65%, 55%)',   // Coral
    'hsl(43, 74%, 50%)',   // Gold
    'hsl(220, 60%, 50%)',  // Blue
    'hsl(280, 50%, 50%)',  // Purple
    'hsl(340, 60%, 50%)',  // Pink
    'hsl(150, 50%, 40%)',  // Green
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const generateRandomLetter = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)];
};

const generateRandomMetric = () => Math.floor(Math.random() * 5) + 1;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = useCallback(() => {
    const newUser: UserProfile = {
      letter: generateRandomLetter(),
      color: generateRandomColor(),
      metrics: {
        focus: generateRandomMetric(),
        skill: generateRandomMetric(),
        revision: generateRandomMetric(),
        attitude: generateRandomMetric(),
        potential: generateRandomMetric(),
      },
    };
    setUser(newUser);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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
