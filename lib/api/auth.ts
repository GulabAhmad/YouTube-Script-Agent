import Cookies from 'js-cookie';


// const API_URL = "https://youtubescriptagentbackend-production.up.railway.app"//web-production-f958c.up.railway.app';
const API_URL = "http://localhost:8000"

export interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        is_verified: boolean;
        created_at: string;
        updated_at: string;
    };
}

export interface UserResponse {
    user_id: number;
    email: string;
    message: string;
}

export interface VerifyEmailResponse {
    detail: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    verification_code: string;
    new_password: string;
    confirm_password: string;
}

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

export const authService = {
    async register(data: RegisterData): Promise<UserResponse> {
        try {
            console.log('Registering user:', { email: data.email });
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: defaultHeaders,
                body: JSON.stringify(data),
                credentials: 'include', // Important for CORS
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Registration failed:', errorData);
                throw new Error(errorData.detail || 'Registration failed');
            }

            const responseData = await response.json();
            console.log('Registration successful');
            return responseData;
        } catch (error) {
            console.error('Registration error:', error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
            }
            throw error;
        }
    },

    async verifyEmail(email: string, code: string): Promise<VerifyEmailResponse> {
        try {
            console.log('Verifying email:', { email });
            const response = await fetch(`${API_URL}/verify-email`, {
                method: 'POST',
                headers: defaultHeaders,
                body: JSON.stringify({ email, verification_code: code }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Verification failed:', errorData);
                throw new Error(errorData.detail || 'Verification failed');
            }

            const responseData = await response.json();
            console.log('Email verification successful');
            return responseData;
        } catch (error) {
            console.error('Verification error:', error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
            }
            throw error;
        }
    },

    async login(data: LoginData): Promise<LoginResponse> {
        try {
            console.log('Attempting login:', { email: data.email });
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: defaultHeaders,
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Login failed:', errorData);
                throw new Error(errorData.detail || 'Login failed');
            }

            const responseData = await response.json();
            console.log('Login successful, storing data');
            
            // Store token in cookies
            Cookies.set('access_token', responseData.token, {
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                expires: 1, // 1 day
            });

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(responseData.user));
            localStorage.setItem('userId', responseData.user.id.toString());
            localStorage.setItem('userEmail', responseData.user.email);
            localStorage.setItem('userFirstName', responseData.user.first_name);
            localStorage.setItem('userLastName', responseData.user.last_name);
            localStorage.setItem('userIsVerified', responseData.user.is_verified.toString());
            localStorage.setItem('userCreatedAt', responseData.user.created_at);
            localStorage.setItem('userUpdatedAt', responseData.user.updated_at);

            return responseData;
        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
            }
            throw error;
        }
    },

    async refreshToken(): Promise<TokenResponse> {
        const refreshToken = Cookies.get('refresh_token');

        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await fetch(`${API_URL}/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Token refresh failed');
        }

        const tokens = await response.json();
        
        // Update tokens in cookies
        Cookies.set('access_token', tokens.access_token, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: 1, // 1 day
        });

        Cookies.set('refresh_token', tokens.refresh_token, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: 7, // 7 days
        });

        return tokens;
    },

    async logout(): Promise<void> {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
    },

    getAccessToken(): string | undefined {
        return Cookies.get('access_token');
    },

    isAuthenticated(): boolean {
        return !!Cookies.get('access_token');
    },

    async forgotPassword(email: string): Promise<{ message: string }> {
        try {
            console.log('Requesting password reset for:', { email });
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: defaultHeaders,
                body: JSON.stringify({ email }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Forgot password request failed:', errorData);
                throw new Error(errorData.detail || 'Failed to send reset code');
            }

            const responseData = await response.json();
            console.log('Reset code sent successfully');
            return responseData;
        } catch (error) {
            console.error('Forgot password error:', error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
            }
            throw error;
        }
    },

    async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
        try {
            console.log('Resetting password with verification code');
            const response = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: defaultHeaders,
                body: JSON.stringify({
                    verification_code: data.verification_code,
                    new_password: data.new_password,
                    confirm_password: data.confirm_password
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Password reset failed:', errorData);
                throw new Error(errorData.detail || 'Failed to reset password');
            }

            const responseData = await response.json();
            console.log('Password reset successful');
            return responseData;
        } catch (error) {
            console.error('Reset password error:', error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
            }
            throw error;
        }
    },
}; 