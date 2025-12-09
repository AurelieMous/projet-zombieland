// fonction de connexion login et register

import axiosInstance from "./getApi.ts";
import type {User} from "../@types/users";

interface LoginResponse {
    user: User;
    token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    console.log(email, password);
    console.log('Base URL:', axiosInstance.defaults.baseURL); // ✅ Voir le baseURL

    const response = await axiosInstance.post<LoginResponse>('auth/login', {
        email,
        password
    });
    return response.data;
};

export const getProfile = async (): Promise<User> => {
    const response = await axiosInstance.get<LoginResponse>('auth/me');
    return response.data.user;
}