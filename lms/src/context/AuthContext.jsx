import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (user) {
          user.id = decoded.id;
          user.currentRole = decoded.currentRole;
        }
      } catch (error) {
        console.error("Failed to decode token on initial load:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { token: null, user: null };
      }
    }
    return { token, user };
  });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (auth.token) {
      const decoded = jwtDecode(auth.token);
      setAuth(prev => ({
        ...prev,
        user: { ...prev.user, id: decoded.id, currentRole: decoded.currentRole },
      }));
    }
  }, [auth.token]);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = async (callback) => {
    if (auth.token) {
      try {
        const response = await axios.delete(`${backendUrl}/api/user/chat-history`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        
        // Only proceed with logout if the server confirms success
        if (response.data.success) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuth({ token: null, user: null });
          if (typeof callback === 'function') {
            callback();
          }
        } else {
          // If server reports failure, log it but don't clear local session
          console.error('Server failed to delete chat history:', response.data.message);
          // Optionally, inform the user
          // toast.error("Logout failed. Please try again.");
        }
      } catch (error) {
        console.error('Failed to delete chat history', error);
         // toast.error("Logout failed. Please try again.");
      }
    } else {
      // If there's no token, just clear local state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuth({ token: null, user: null });
      if (typeof callback === 'function') {
        callback();
      }
    }
  };

  const updateAuthUser = (updatedUser) => {
    setAuth(prevAuth => ({
      ...prevAuth,
      user: {
        ...prevAuth.user,
        ...updatedUser,
      },
    }));
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
