const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createAuthenticatedRequest = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    token: string,
    body?: object
) => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    const requestOptions: RequestInit = {
        method,
        headers
    };

    if (body) {
        requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return { error: true, message: "Authentication error: Your session has expired" };
    }

    const data = await response.json();

    if (Array.isArray(data)) {
        return { data, status: response.status };
      }

    return { ...data, status: response.status };
};