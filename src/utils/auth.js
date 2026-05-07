// src/utils/auth.js
export const isAuthenticated = () => {
  return !!sessionStorage.getItem("token");
};

export const getRole = () => sessionStorage.getItem("role");