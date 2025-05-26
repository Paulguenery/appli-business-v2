import React, { useState } from 'react';
import { Send, Video } from 'lucide-react';
import { CallModal } from '@/components/video-call/CallModal';
import { useAuth } from '@/hooks/use-auth';
import { validateMessage } from '@/lib/message-validator';
import { useSubscription } from '@/hooks/use-subscription';

export function Messages() {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isPremium } = useAuth();
  const { limits } = useSubscription();

  const conversations = [
    {
      id: 1,
      with: 'Sarah Chen',
      participantId: 'user-123',
      messages: [
        { id: 1, sender: 'Sarah Chen', text: 'Hi! I saw your profile and I think we could work well together.', time: '10:30 AM' },
        { id: 2, sender: 'You', text: 'Thanks for reaching out! I\'d love to hear more about your project.', time: '10:35 AM' },
      ],
    },
    // ... autres conversations
  ];

  const handleSendMessage = () => {
    // Validation du message
    const validation = validateMessage(newMessage);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    // Vérification des limites de messages
    if (!isPremium && limits.dailyMessages === 0) {
      setError('Vous avez atteint votre limite de messages quotidienne');
      return;
    }

    // Envoi du message
    console.log('Sending message:', newMessage);
    setNewMessage('');
    setError(null);
  };

  const startCall = (participantId: string) => {
    const callId = `call-${Date.now()}`;
    setActiveCallId(callId);
    setActiveParticipantId(participantId);
    setIsCallModalOpen(true);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex">
      <div className="w-1/3 border-r">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="font-medium">{conv.with}</div>
                <div className="text-sm text-gray-500 truncate">
                  {conv.messages[conv.messages.length - 1].text}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium">Sarah Chen</h3>
          <button
            onClick={() => startCall('user-123')}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <Video className="h-5 w-5 text-gray-600" />
            <span>Appel vidéo</span>
          </button>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {conversations[0].messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'You' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-sm rounded-lg p-3 ${
                  message.sender === 'You'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <p>{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'You' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          {error && (
            <div className="mb-2 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
              disabled={!isPremium && limits.dailyMessages === 0}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {!isPremium && (
            <p className="mt-2 text-sm text-gray-500">
              Messages restants aujourd'hui : {limits.dailyMessages}
            </p>
          )}
        </div>
      </div>

      {activeCallId && activeParticipantId && (
        <CallModal
          open={isCallModalOpen}
          onOpenChange={setIsCallModalOpen}
          callId={activeCallId}
          participantId={activeParticipantId}
          title="Appel vidéo"
        />
      )}
    </div>
  );
}