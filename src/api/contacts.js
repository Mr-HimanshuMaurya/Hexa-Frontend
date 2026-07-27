import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosInstance';

export const useContacts = (page = 1, search = '', tag = '') =>
  useQuery({
    queryKey: ['contacts', page, search, tag],
    queryFn: async () => {
      const { data } = await api.get('/contacts', {
        params: { page, limit: 20, search, tag },
      });
      return data;
    },
  });

export const useCreateContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/contacts', payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contacts'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useBulkCreateContacts = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/contacts/bulk', payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contacts'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/contacts/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contacts'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useBulkDeleteContacts = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids) => {
      const { data } = await api.delete('/contacts/bulk', { data: { ids } });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contacts'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useExtractPaste = () =>
  useMutation({
    mutationFn: async (text) => {
      const { data } = await api.post('/contacts/extract-paste', { text });
      return data.data;
    },
  });

export const useUploadExcel = () =>
  useMutation({
    mutationFn: async (file) => {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post('/contacts/upload/excel', form);
      return data.data;
    },
  });

export const useUploadCsv = () =>
  useMutation({
    mutationFn: async (file) => {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post('/contacts/upload/csv', form);
      return data.data;
    },
  });

export const useUploadScreenshot = () =>
  useMutation({
    mutationFn: async (file) => {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post('/contacts/upload/screenshot', form, {
        timeout: 120000,
      });
      return data.data;
    },
  });
