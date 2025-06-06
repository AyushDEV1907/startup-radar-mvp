
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const { session, isLoading: sessionLoading } = useSessionContext();
  
  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ['user-role', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        // Fallback to user metadata
        return session.user.user_metadata?.role || null;
      }

      return data?.role || null;
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user: session?.user || null,
    session,
    userRole,
    loading: sessionLoading || roleLoading,
    signOut,
    isAuthenticated: !!session?.user,
    isInvestor: userRole === 'investor',
    isFounder: userRole === 'founder'
  };
}
