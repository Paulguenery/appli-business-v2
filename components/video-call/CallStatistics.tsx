import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Phone, PhoneMissed, PhoneOff, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CallStats {
  total_calls: number;
  total_duration: string;
  missed_calls: number;
  failed_calls: number;
  average_duration: string;
}

function formatDuration(duration: string) {
  const matches = duration.match(/(\d+):(\d+):(\d+)/);
  if (!matches) return duration;
  const [, hours, minutes, seconds] = matches;
  return `${hours}h ${minutes}m ${seconds}s`;
}

export function CallStatistics() {
  const { data: stats } = useQuery<CallStats>({
    queryKey: ['call-statistics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('call_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (!stats) {
    return null;
  }

  const metrics = [
    {
      title: 'Appels totaux',
      value: stats.total_calls,
      icon: Phone,
      color: 'text-blue-500'
    },
    {
      title: 'Appels manqués',
      value: stats.missed_calls,
      icon: PhoneMissed,
      color: 'text-yellow-500'
    },
    {
      title: 'Appels échoués',
      value: stats.failed_calls,
      icon: PhoneOff,
      color: 'text-red-500'
    },
    {
      title: 'Durée moyenne',
      value: formatDuration(stats.average_duration),
      icon: Clock,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            {metric.title === 'Durée moyenne' && stats.total_calls > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Sur {stats.total_calls} appel{stats.total_calls > 1 ? 's' : ''}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}