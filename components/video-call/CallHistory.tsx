import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Phone, PhoneOff, PhoneMissed, Clock } from 'lucide-react';

interface CallRecord {
  id: string;
  caller: { full_name: string };
  receiver: { full_name: string };
  start_time: string;
  end_time: string | null;
  duration: string | null;
  status: 'completed' | 'missed' | 'failed';
}

export function CallHistory() {
  const { data: calls = [] } = useQuery<CallRecord[]>({
    queryKey: ['call-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('call_history')
        .select(`
          *,
          caller:caller_id(full_name),
          receiver:receiver_id(full_name)
        `)
        .or(`caller_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('start_time', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'missed':
        return <PhoneMissed className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <PhoneOff className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const formatDuration = (duration: string) => {
    const matches = duration.match(/(\d+):(\d+):(\d+)/);
    if (!matches) return duration;
    const [, hours, minutes, seconds] = matches;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (calls.length === 0) {
    return (
      <div className="text-center py-8">
        <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Aucun appel</h3>
        <p className="mt-1 text-sm text-gray-500">
          Votre historique d'appels apparaîtra ici
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {calls.map((call) => (
        <div
          key={call.id}
          className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 rounded-full">
              {getStatusIcon(call.status)}
            </div>
            <div>
              <h3 className="font-medium">
                {call.caller.full_name} → {call.receiver.full_name}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(call.start_time), {
                  addSuffix: true,
                  locale: fr
                })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              {format(new Date(call.start_time), 'HH:mm', { locale: fr })}
            </div>
            {call.duration && (
              <div className="text-xs text-gray-500">
                {formatDuration(call.duration)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}