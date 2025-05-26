import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  RTCConfig,
  getLocalStream,
  createPeerConnection,
  addTracksToConnection,
  stopMediaStream
} from '@/lib/webrtc';

interface UseVideoCallProps {
  callId: string;
  participantId: string;
  onCallEnded?: () => void;
}

export function useVideoCall({ callId, participantId, onCallEnded }: UseVideoCallProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callHistoryId, setCallHistoryId] = useState<string | null>(null);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const signalChannel = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const initializeCall = async () => {
      try {
        // Create call history entry
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: historyEntry, error: historyError } = await supabase
          .from('call_history')
          .insert({
            caller_id: user.id,
            receiver_id: participantId,
            status: 'completed'
          })
          .select()
          .single();

        if (historyError) throw historyError;
        setCallHistoryId(historyEntry.id);

        // Get local media stream
        const { stream, error: streamError } = await getLocalStream();
        if (streamError) {
          setError(streamError);
          return;
        }
        if (!stream) return;
        setLocalStream(stream);

        // Create peer connection
        const { peerConnection: pc, error: pcError } = createPeerConnection();
        if (pcError) {
          setError(pcError);
          return;
        }
        if (!pc) return;
        peerConnection.current = pc;

        // Add local tracks to peer connection
        addTracksToConnection(pc, stream);

        // Handle incoming tracks
        pc.ontrack = (event) => {
          setRemoteStream(new MediaStream(event.streams[0].getTracks()));
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
          setIsConnected(pc.connectionState === 'connected');
          if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            updateCallHistory('failed');
            onCallEnded?.();
          }
        };

        // Handle ICE candidates
        pc.onicecandidate = async (event) => {
          if (event.candidate) {
            await supabase
              .from('call_signals')
              .insert({
                call_id: callId,
                sender_id: user.id,
                receiver_id: participantId,
                type: 'ice_candidate',
                signal: event.candidate
              });
          }
        };

        // Set up signaling channel
        const channel = supabase.channel(`call:${callId}`);
        signalChannel.current = channel;

        channel.on('broadcast', { event: 'signal' }, async ({ payload }) => {
          try {
            const { type, signal } = payload;

            if (type === 'offer') {
              await pc.setRemoteDescription(new RTCSessionDescription(signal));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);

              await supabase
                .from('call_signals')
                .insert({
                  call_id: callId,
                  sender_id: user.id,
                  receiver_id: participantId,
                  type: 'answer',
                  signal: answer
                });
            }
            else if (type === 'answer') {
              await pc.setRemoteDescription(new RTCSessionDescription(signal));
            }
            else if (type === 'ice_candidate') {
              await pc.addIceCandidate(new RTCIceCandidate(signal));
            }
          } catch (error) {
            console.error('Error handling signal:', error);
            setError('Error establishing connection');
            updateCallHistory('failed');
          }
        });

        await channel.subscribe();

        // Create and send offer if initiator
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        await supabase
          .from('call_signals')
          .insert({
            call_id: callId,
            sender_id: user.id,
            receiver_id: participantId,
            type: 'offer',
            signal: offer
          });

      } catch (error) {
        console.error('Error initializing call:', error);
        setError('Error accessing media devices');
        updateCallHistory('failed');
      }
    };

    initializeCall();

    return () => {
      // Update call history when component unmounts
      updateCallHistory('completed');

      // Cleanup
      if (localStream) {
        stopMediaStream(localStream);
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (signalChannel.current) {
        signalChannel.current.unsubscribe();
      }
    };
  }, [callId, participantId]);

  const updateCallHistory = async (status: 'completed' | 'missed' | 'failed') => {
    if (!callHistoryId) return;

    await supabase
      .from('call_history')
      .update({
        end_time: new Date().toISOString(),
        status
      })
      .eq('id', callHistoryId);
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
    }
  };

  const endCall = async () => {
    await updateCallHistory('completed');
    
    if (localStream) {
      stopMediaStream(localStream);
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    onCallEnded?.();
  };

  return {
    localStream,
    remoteStream,
    isConnected,
    error,
    toggleVideo,
    toggleAudio,
    endCall
  };
}