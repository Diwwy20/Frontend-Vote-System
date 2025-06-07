import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister, getProfile } from '@/services/auth/authService';
import type { LoginData, RegisterData } from '@/services/auth/authService';

// Token Storage Utility
const tokenStorage = {
  get: () => {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  },
  set: (token: string) => {
    try {
      localStorage.setItem('token', token);
      return true;
    } catch {
      return false;
    }
  },
  remove: () => {
    try {
      localStorage.removeItem('token');
      return true;
    } catch {
      return false;
    }
  }
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const getToken = () => tokenStorage.get();
  const isAuthenticated = !!getToken();

  const { 
    data: user, 
    isLoading: isLoadingUser,
    error: userError,
    isError
  } = useQuery({
    queryKey: ['user'],
    queryFn: getProfile,
    enabled: isAuthenticated, // จะทำงานเฉพาะเมื่อมี token
    retry: (failureCount, error: any) => {
      // ถ้า error เป็น 401 (Unauthorized) ไม่ต้อง retry
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // เก็บ cache ไว้ 10 นาที
  });

  // จัดการ Token Expiration
  useEffect(() => {
    if (isError && userError?.response?.status === 401 && isAuthenticated) {
      // Clear token และ cache
      tokenStorage.remove();
      queryClient.removeQueries({ queryKey: ['user'] });
      queryClient.clear();
      
      // ใช้ setTimeout เพื่อป้องกัน navigation ในระหว่าง render
      setTimeout(() => {
        toast.error('Session expired. Please login again.');
        navigate('/login', { replace: true });
      }, 0);
    }
  }, [isError, userError, isAuthenticated, navigate, queryClient]);

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: apiLogin,
    onSuccess: (data) => {
      if (data.token) {
        tokenStorage.set(data.token as string);
        queryClient.setQueryData(['user'], data.user);
        toast.success('Login successful!');
        navigate('/', { replace: true });
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Login failed';
      toast.error(message);
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: apiRegister,
    onSuccess: (data) => {
      if (data.success && data.token && data.user) {
        tokenStorage.set(data.token);
        queryClient.setQueryData(['user'], data.user);
        toast.success('Registration successful!');
        navigate('/', { replace: true });
      } else {
        toast.error(data.message || 'Registration failed');
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Registration failed';
      toast.error(message);
    },
  });

  // Logout Function
  const logout = () => {
    tokenStorage.remove();
    queryClient.removeQueries({ queryKey: ['user'] });
    queryClient.clear();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  // Login Function
  const login = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  // Register Function
  const register = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  return {
    user: user || null,
    isLoading: isLoadingUser || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated: isAuthenticated && !isError && !!user, // ต้องมี token, ไม่มี error, และมี user data
    login,
    register,
    logout,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};