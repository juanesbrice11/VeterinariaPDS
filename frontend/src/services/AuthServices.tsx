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

export const loginUser = async (userData: { email: string, password: string }) => {
    console.log(API_URL);
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return await response.json();
};

export const logoutUser = async () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const requestPasswordReset = async (email: string) => {
  const res = await fetch("http://localhost:3000/api/auth/reset-password-request", {
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
