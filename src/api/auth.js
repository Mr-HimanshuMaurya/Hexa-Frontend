import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosInstance';
import { useAuthStore } from '../store/useAuthStore';

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post('/auth/login', { email, password });
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async ({ name, email, password }) => {
      const { data } = await api.post('/auth/register', { name, email, password });
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
};

export const useMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get('/auth/me');
      return data.user;
    },
    enabled: !!useAuthStore.getState().token,
    retry: false,
  });
