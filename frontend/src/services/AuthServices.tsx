import { RegisterUserData } from "@/types/schemas";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (userData: RegisterUserData) => {

  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return await response.json();
};

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
};

export const logoutUser = async () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const requestPasswordReset = async (email: string) => {
  const res = await fetch(`${API_URL}/auth/reset-password-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error");
  return data;
};

export const validateToken = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/validate`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    return {
      valid: !!data.valid,
      user: data.user || null,
      message: data.message || null
    };
  } catch (error) {
    console.error("Error validando token:", error);
    return { valid: false, user: null, message: "Error de conexión" };
  }
};

export const checkAuthStatus = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  const validation = await validateToken(token);

  if (!validation.valid) {
    localStorage.removeItem("token");
    return { isAuthenticated: false, user: null };
  }

  return {
    isAuthenticated: true,
    user: validation.user
  };
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error changing password");
    }

    return { success: true, message: data.message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
