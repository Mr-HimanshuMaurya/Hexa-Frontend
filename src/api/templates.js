import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosInstance';

export const useTemplates = (page = 1, search = '') =>
  useQuery({
    queryKey: ['templates', page, search],
    queryFn: async () => {
      const { data } = await api.get('/templates', { params: { page, limit: 12, search } });
      return data;
    },
  });

export const useTemplate = (id) =>
  useQuery({
    queryKey: ['templates', id],
    queryFn: async () => {
      const { data } = await api.get(`/templates/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

export const useCreateTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/templates', payload);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }),
  });
};

export const useUpdateTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put(`/templates/${id}`, payload);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }),
  });
};

export const useDeleteTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/templates/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }),
  });
};
