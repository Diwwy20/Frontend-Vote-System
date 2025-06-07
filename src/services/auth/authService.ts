import api from "./authApi";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at: Date;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user: User;
  message: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
    try {
        const response = await api.post('/auth/login', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      
        const response = await api.post('/auth/register', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }  
};

export const getProfile = async (): Promise<User> => {
    try {
        const response = await api.get('/auth/user');
        return response.data;
    } catch (error: any) {
        throw error;
    }  
};

export const updateProfile = async (data: FormData): Promise<UpdateProfileResponse> => {
    try {
        const response = await api.put('/auth/user', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
};

export const changePassword = async (data: ChangePasswordData): Promise<ChangePasswordResponse> => {
  try {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};