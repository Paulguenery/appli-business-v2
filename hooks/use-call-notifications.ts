import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';

interface CallNotification {
  id: string;
  callId: string;
  callerName: string;
}

export function useCallNotifications() {
  const { user } = useAuth();
  const [incomingCall, setIncomingCall] = useState<CallNotification | null>(null);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('call_notifications')
      .on('broadcast', { event: 'incoming_call' }, async (payload) => {
        const { callId, callerId } = payload;

        // Get caller profile
        const { data: callerProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', callerId)
          .single();

        if (callerProfile) {
          setIncomingCall({
            id: crypto.randomUUID(),
            callId,
            callerName: callerProfile.full_name
          });
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const clearIncomingCall = () => {
    setIncomingCall(null);
  };

  return {
    incomingCall,
    clearIncomingCall
  };
}