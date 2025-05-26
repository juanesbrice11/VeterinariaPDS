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

    try {
        console.log(`Making ${method} request to:`, url);
        const response = await fetch(url, requestOptions);
        console.log('Response status:', response.status);

        if (response.status === 401) {
            console.log('Authentication error: Session expired');
            localStorage.removeItem('token');
            window.location.href = '/login';
            return { 
                status: 401,
                success: false,
                message: "Authentication error: Your session has expired" 
            };
        }

        if (response.status === 403) {
            console.log('Authorization error: Access denied');
            return { 
                status: 403,
                success: false,
                message: "Access denied: You don't have permission to perform this action" 
            };
        }

        const data = await response.json();
        console.log('Response data:', data);

        // Handle specific case for service deletion with associated appointments
        if (response.status === 400 && method === 'DELETE' && url.includes('/services/admin/')) {
            return { 
                status: 400,
                success: false,
                message: "This service cannot be deleted because it has associated appointments. Please remove or reassign the appointments first."
            };
        }

        if (Array.isArray(data)) {
            return { 
                status: response.status,
                success: true,
                data, 
                message: 'Data retrieved successfully' 
            };
        }

        return { 
            ...data, 
            status: response.status,
            success: response.status >= 200 && response.status < 300
        };
    } catch (error) {
        console.error('Request error:', error);
        return { 
            status: 500,
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        };
    }
};