import 'webrtc-adapter';

export const RTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 10
};

export async function getLocalStream(constraints = { video: true, audio: true }) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return { stream, error: null };
  } catch (error) {
    console.error('Error accessing media devices:', error);
    return {
      stream: null,
      error: 'Could not access camera/microphone. Please check permissions.'
    };
  }
}

export function createPeerConnection() {
  try {
    const pc = new RTCPeerConnection(RTCConfig);
    return { peerConnection: pc, error: null };
  } catch (error) {
    console.error('Error creating peer connection:', error);
    return {
      peerConnection: null,
      error: 'Could not establish peer connection. Please try again.'
    };
  }
}

export function addTracksToConnection(pc: RTCPeerConnection, stream: MediaStream) {
  stream.getTracks().forEach(track => {
    pc.addTrack(track, stream);
  });
}

export function stopMediaStream(stream: MediaStream) {
  stream.getTracks().forEach(track => track.stop());
}