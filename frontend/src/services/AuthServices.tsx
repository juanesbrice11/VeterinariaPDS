const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
    documentType: string;
    documentNumber: string;
    status?: string;
    role?: string;
  }) => {
    
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await response.json();
  };
  
  export const loginUser = async (userData: {email: string, password: string}) => {
    console.log(userData);
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await response.json();
  };