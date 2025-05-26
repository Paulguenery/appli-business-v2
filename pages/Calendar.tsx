import React, { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { NewAppointmentModal } from '@/components/calendar/NewAppointmentModal';
import { AppointmentDetailsModal } from '@/components/calendar/AppointmentDetailsModal';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Appointment } from '@/lib/types';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function Calendar() {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          creator:creator_id(full_name),
          participant:participant_id(full_name)
        `)
        .or(`creator_id.eq.${profile.id},participant_id.eq.${profile.id}`);

      if (error) throw error;

      return data.map(appointment => ({
        ...appointment,
        start: new Date(appointment.start_time),
        end: new Date(appointment.end_time),
        title: `RDV avec ${
          appointment.creator_id === profile.id
            ? appointment.participant.full_name
            : appointment.creator.full_name
        }`,
      }));
    },
  });

  const { mutate: deleteAppointment } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setSelectedAppointment(null);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Agenda des rendez-vous</h1>
            <Button onClick={() => setIsNewModalOpen(true)}>
              Nouveau rendez-vous
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <BigCalendar
            localizer={localizer}
            events={appointments}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            defaultView="week"
            views={['month', 'week', 'day']}
            messages={{
              next: 'Suivant',
              previous: 'Précédent',
              today: "Aujourd'hui",
              month: 'Mois',
              week: 'Semaine',
              day: 'Jour',
            }}
            onSelectEvent={(event) => setSelectedAppointment(event as Appointment)}
          />
        </div>

        <NewAppointmentModal
          open={isNewModalOpen}
          onOpenChange={setIsNewModalOpen}
        />

        {selectedAppointment && (
          <AppointmentDetailsModal
            appointment={selectedAppointment}
            open={!!selectedAppointment}
            onOpenChange={() => setSelectedAppointment(null)}
            onDelete={() => deleteAppointment(selectedAppointment.id)}
          />
        )}
      </div>
    </div>
  );
}