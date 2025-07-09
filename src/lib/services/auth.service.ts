import { useApi } from '@/lib/hooks/useApi';
import { BACKEND_URL, BACKEND_URL_WITH_WEBSITE_ID } from '../constants/base';
import { User } from '../types/user';

export interface SignInRequest {
    username: string;
    password: string;
    turnstileToken?: string;
}

export interface SignInResponse {
    accessToken: string;
    refreshToken: string;
}

export interface SignUpRequest {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    turnstileToken?: string;
}

export interface SignUpResponse {
    accessToken: string;
    refreshToken: string;
}

export const useAuthService = () => {
    const { post, get } = useApi({ baseUrl: BACKEND_URL_WITH_WEBSITE_ID });

    const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
        const response = await post<SignInResponse>('/auth/signin', data);
        return response.data;
    };

    const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
        const response = await post<SignUpResponse>('/auth/signup', data);
        return response.data;
    };

    const getMe = async (): Promise<User> => {
        const response = await get<User>('/users/me', {}, true);
        return response.data;
    };

    return {
        signIn,
        signUp,
        getMe
    };
}; 