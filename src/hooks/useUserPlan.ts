
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useInvestorAuth } from './useInvestorAuth';

export function useUserPlan() {
  const { user } = useInvestorAuth();
  const [plan, setPlan] = useState<string>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user) {
        setPlan('free');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('plan')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user plan:', error);
          setPlan('free');
        } else {
          setPlan(data?.plan || 'free');
        }
      } catch (error) {
        console.error('Error fetching user plan:', error);
        setPlan('free');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, [user]);

  const refreshPlan = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setPlan(data.plan || 'free');
      }
    } catch (error) {
      console.error('Error refreshing user plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    plan,
    loading,
    refreshPlan,
    isPro: plan === 'pro' || plan === 'premium',
    isPremium: plan === 'premium'
  };
}
