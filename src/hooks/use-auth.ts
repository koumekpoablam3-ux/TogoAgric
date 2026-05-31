'use client';
import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  bio?: string;
}

// Simple hash to avoid storing plaintext passwords
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

const knownUsers: Record<string, { pwdHash: string; user: User }> = {
  'admin@togoagric.tg': { pwdHash: simpleHash('admin123'), user: { id: 'admin1', name: 'Admin TogoAgric', email: 'admin@togoagric.tg', role: 'admin', phone: '+228 90 00 00 00', bio: 'Administrateur de la plateforme TogoAgric' } },
  'kossi@togoagric.tg': { pwdHash: simpleHash('password123'), user: { id: 'user1', name: 'Kossi Amouzou', email: 'kossi@togoagric.tg', role: 'farmer', phone: '+228 90 12 34 56', bio: 'Agriculteur de cereales et tubercules base a Sokode' } },
  'afi@togoagric.tg': { pwdHash: simpleHash('password123'), user: { id: 'user2', name: 'Afi Mensah', email: 'afi@togoagric.tg', role: 'farmer', phone: '+228 91 23 45 67', bio: 'Maraichere specialisee en legumes et fruits a Lome' } },
  'tchao@togoagric.tg': { pwdHash: simpleHash('password123'), user: { id: 'user3', name: 'Tchao Palouki', email: 'tchao@togoagric.tg', role: 'farmer', phone: '+228 92 34 56 78', bio: 'Producteur d\'igname et eleveur dans la region de la Kara' } },
  'adjo@togoagric.tg': { pwdHash: simpleHash('password123'), user: { id: 'user4', name: 'Adjo Dzokoto', email: 'adjo@togoagric.tg', role: 'farmer', phone: '+228 93 45 67 89', bio: 'Productrice de cafe et cacao dans les Plateaux' } },
  'yao@togoagric.tg': { pwdHash: simpleHash('password123'), user: { id: 'user5', name: 'Yao Degbe', email: 'yao@togoagric.tg', role: 'buyer', phone: '+228 94 56 78 90', bio: 'Commercant en produits agricoles a Lome' } },
  'sena@togoagric.tg': { pwdHash: simpleHash('password123'), user: { id: 'user6', name: 'Sena Bodjona', email: 'sena@togoagric.tg', role: 'buyer', phone: '+228 95 67 89 01', bio: 'Restaurateur cherchant des produits frais locaux' } },
  'bouraima@togoagric.tg': { pwdHash: simpleHash('password123'), user: { id: 'user7', name: 'Bouraima Ouro', email: 'bouraima@togoagric.tg', role: 'farmer', phone: '+228 96 78 90 12', bio: 'Eleveur et cultivateur dans les Savanes' } },
};

function loadUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('togoagric_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveUserToStorage(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('togoagric_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('togoagric_user');
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = loadUserFromStorage();
    setUser(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const match = knownUsers[email];
    if (match && match.pwdHash === simpleHash(password)) {
      setUser(match.user);
      saveUserToStorage(match.user);
      return true;
    }
    return false;
  }, []);

  const register = useCallback((name: string, email: string, _password: string, role: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      bio: '',
    };
    setUser(newUser);
    saveUserToStorage(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveUserToStorage(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };
}
