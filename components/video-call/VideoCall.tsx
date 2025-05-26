import React, { useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoCall } from '@/hooks/use-video-call';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoCallProps {
  callId: string;
  participantId: string;
  onEnd: () => void;
}

export function VideoCall({ callId, participantId, onEnd }: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);

  const {
    localStream,
    remoteStream,
    isConnected,
    error,
    toggleVideo,
    toggleAudio,
    endCall
  } = useVideoCall({
    callId,
    participantId,
    onCallEnded: onEnd
  });

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleToggleVideo = () => {
    toggleVideo();
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleToggleAudio = () => {
    toggleAudio();
    setIsAudioEnabled(!isAudioEnabled);
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black flex items-center justify-center"
      >
        <div className="text-white text-center">
          <p className="text-xl mb-4">{error}</p>
          <Button onClick={onEnd} variant="destructive">
            End Call
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex flex-col"
    >
      {/* Remote video (full screen) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Local video (picture-in-picture) */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-lg"
      >
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Connection status */}
      <AnimatePresence>
        {!isConnected && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-4 left-4 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm"
          >
            Connecting...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
      >
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleToggleVideo}
            variant={isVideoEnabled ? 'default' : 'destructive'}
            size="icon"
            className="rounded-full h-12 w-12 transition-transform hover:scale-110"
          >
            {isVideoEnabled ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </Button>

          <Button
            onClick={handleToggleAudio}
            variant={isAudioEnabled ? 'default' : 'destructive'}
            size="icon"
            className="rounded-full h-12 w-12 transition-transform hover:scale-110"
          >
            {isAudioEnabled ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </Button>

          <Button
            onClick={endCall}
            variant="destructive"
            size="icon"
            className="rounded-full h-12 w-12 transition-transform hover:scale-110"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}