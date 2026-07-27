import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosInstance';

export const useCampaigns = (page = 1) =>
  useQuery({
    queryKey: ['campaigns', page],
    queryFn: async () => {
      const { data } = await api.get('/campaigns', { params: { page, limit: 10 } });
      return data;
    },
  });

export const useCampaign = (id) =>
  useQuery({
    queryKey: ['campaigns', id],
    queryFn: async () => {
      const { data } = await api.get(`/campaigns/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

export const useCampaignProgress = (id, enabled = true) =>
  useQuery({
    queryKey: ['campaign', id, 'progress'],
    queryFn: async () => {
      const { data } = await api.get(`/campaigns/${id}/progress`);
      return data.data;
    },
    enabled: !!id && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'sending' ? 2000 : false;
    },
  });

export const useCampaignLogs = (id, page = 1, status = '') =>
  useQuery({
    queryKey: ['campaign', id, 'logs', page, status],
    queryFn: async () => {
      const { data } = await api.get(`/campaigns/${id}/logs`, {
        params: { page, limit: 50, status: status || undefined },
      });
      return data;
    },
    enabled: !!id,
  });

export const useCreateCampaign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/campaigns', payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaigns'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useResumeCampaign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.post(`/campaigns/${id}/resume`);
      return data.data;
    },
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ['campaign', id] });
      qc.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/campaigns/stats/dashboard');
      return data.data;
    },
  });
