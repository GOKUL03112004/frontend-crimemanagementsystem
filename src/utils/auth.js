// src/utils/auth.js
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getRole = () => localStorage.getItem("role");