import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('medico_token') || null);
  const [loading, setLoading] = useState(true);

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('medico_token');
    localStorage.removeItem('medico_user');
    setToken(null);
    setUser(null);
    setProfile(null);
  }, []);

  // Hydrate user from API when token exists
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('medico_token');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getCurrentUser();
      if (response?.data?.user) {
        setUser(response.data.user);
        setProfile(response.data.profile || null);
      } else {
        logout();
      }
    } catch (err) {
      console.error('[AuthContext] Failed to load current user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadUser();

    // Listen for auth-expired event from API interceptor
    const handleExpired = () => {
      logout();
    };
    window.addEventListener('medico-auth-expired', handleExpired);

    return () => {
      window.removeEventListener('medico-auth-expired', handleExpired);
    };
  }, [loadUser, logout]);

  // Login handler
  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { token: newToken, user: newUser, profile: newProfile } = res.data;

    localStorage.setItem('medico_token', newToken);
    localStorage.setItem('medico_user', JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
    setProfile(newProfile);

    return { user: newUser, profile: newProfile, token: newToken };
  };

  // Register Patient handler
  const registerPatient = async (patientData) => {
    const res = await authService.registerPatient(patientData);
    const { token: newToken, user: newUser, profile: newProfile } = res.data;

    localStorage.setItem('medico_token', newToken);
    localStorage.setItem('medico_user', JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
    setProfile(newProfile);

    return { user: newUser, profile: newProfile, token: newToken };
  };

  // Unified Register handler
  const register = async (userData) => {
    const res = await authService.register(userData);
    const { token: newToken, user: newUser, profile: newProfile } = res.data;

    localStorage.setItem('medico_token', newToken);
    localStorage.setItem('medico_user', JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
    setProfile(newProfile);

    return { user: newUser, profile: newProfile, token: newToken };
  };

  // Register Doctor handler
  const registerDoctor = async (doctorData) => {
    const res = await authService.registerDoctor(doctorData);
    const { token: newToken, user: newUser, profile: newProfile } = res.data;

    localStorage.setItem('medico_token', newToken);
    localStorage.setItem('medico_user', JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
    setProfile(newProfile);

    return { user: newUser, profile: newProfile, token: newToken };
  };

  // Update authenticated user state locally
  const updateUserData = (updatedUser, updatedProfile) => {
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem('medico_user', JSON.stringify(updatedUser));
    }
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response?.data?.user) {
        setUser(response.data.user);
        setProfile(response.data.profile || null);
      }
    } catch (err) {
      console.error('[AuthContext] Error refreshing user:', err);
    }
  };

  const role = user?.role || null;
  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    profile,
    token,
    role,
    loading,
    isAuthenticated,
    login,
    register,
    registerPatient,
    registerDoctor,
    logout,
    updateUserData,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
