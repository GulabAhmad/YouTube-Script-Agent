import Cookies from 'js-cookie';

export const getUserIdFromToken = (): number | null => {
    const token = Cookies.get('access_token');
    if (!token) return null;
    
    try {
        // JWT tokens are base64 encoded and have 3 parts separated by dots
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        
        const payload = JSON.parse(jsonPayload);
        return payload.user_id || null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const getUserEmailFromToken = (): string | null => {
    const token = Cookies.get('access_token');
    if (!token) return null;
    
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        
        const payload = JSON.parse(jsonPayload);
        return payload.email || null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const getUserNameFromToken = (): { firstName: string | null, lastName: string | null } => {
    const token = Cookies.get('access_token');
    if (!token) return { firstName: null, lastName: null };
    
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        
        const payload = JSON.parse(jsonPayload);
        return { 
            firstName: payload.first_name || null, 
            lastName: payload.last_name || null 
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return { firstName: null, lastName: null };
    }
};

export const setAccessToken = (token: string) => {
    Cookies.set('access_token', token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: 1 // 1 day
    });
};

export const getAccessToken = (): string | undefined => {
    return Cookies.get('access_token');
};

export const removeAccessToken = () => {
    Cookies.remove('access_token');
}; 