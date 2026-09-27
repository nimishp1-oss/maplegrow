import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function useFinanceData() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const profileQ = useQuery({
    queryKey: ['profile', user?.id],
    enabled: !!user,
    queryFn: async () =>
      (await base44.entities.FinanceProfile.filter({ created_by_id: user.id }, '-created_date', 1))[0] || null,
  });

  const txQ = useQuery({
    queryKey: ['transactions', user?.id],
    enabled: !!user,
    queryFn: () => base44.entities.Transaction.filter({ created_by_id: user.id }, '-date', 200),
  });

  const refreshProfile = () => qc.invalidateQueries({ queryKey: ['profile'] });
  const refreshTx = () => qc.invalidateQueries({ queryKey: ['transactions'] });

  const updateProfile = useMutation({
    mutationFn: (data) => base44.entities.FinanceProfile.update(profileQ.data.id, data),
    onSuccess: refreshProfile,
  });
  const addTransaction = useMutation({
    mutationFn: (data) => base44.entities.Transaction.create(data),
    onSuccess: refreshTx,
  });
  const deleteTransaction = useMutation({
    mutationFn: (id) => base44.entities.Transaction.delete(id),
    onSuccess: refreshTx,
  });

  return {
    user,
    profile: profileQ.data,
    transactions: txQ.data || [],
    isLoading: profileQ.isLoading || txQ.isLoading,
    refreshProfile,
    refreshTx,
    updateProfile,
    addTransaction,
    deleteTransaction,
  };
}