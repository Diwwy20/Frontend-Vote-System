import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister, getProfile } from '@/services/auth/authService';
import type { LoginData, RegisterData } from '@/services/auth/authService';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');
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

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: apiLogin,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token as string);
      queryClient.setQueryData(['user'], data.user);
      toast.success('Login successful!');
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: apiRegister,
    onSuccess: (data) => {
      if (data.success && data.token && data.user) {
        localStorage.setItem('token', data.token);
        queryClient.setQueryData(['user'], data.user);
        toast.success('Registration successful!');
        navigate('/');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });

  // Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    queryClient.removeQueries({ queryKey: ['user'] });
    queryClient.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Login Function
  const login = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  // Register Function
  const register = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  // Handle token expiration - ตรวจสอบเฉพาะ 401 error
  if (isError && userError?.response?.status === 401 && isAuthenticated) {
    // Clear token และ redirect ไป login
    localStorage.removeItem('token');
    queryClient.removeQueries({ queryKey: ['user'] });
    queryClient.clear();
    navigate('/login');
  }

  return {
    user: user || null,
    isLoading: isLoadingUser || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated: isAuthenticated && !isError, // ต้องมี token และไม่มี error
    login,
    register,
    logout,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};