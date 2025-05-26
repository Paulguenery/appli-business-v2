import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function ReferralProgram() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id
  });

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      alert('Code de parrainage copié !');
    }
  };

  const shareReferralCode = () => {
    if (profile?.referral_code) {
      const shareData = {
        title: 'Rejoignez Mymate',
        text: `Utilisez mon code de parrainage ${profile.referral_code} pour obtenir -20% sur votre premier achat !`,
        url: window.location.origin
      };

      if (navigator.share) {
        navigator.share(shareData);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Programme de parrainage</h1>
            <p className="text-gray-600">
              Invitez vos amis et gagnez des récompenses
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Referral Code Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4 mb-6">
              <Gift className="h-8 w-8 text-blue-500" />
              <div>
                <h2 className="text-xl font-semibold">Votre code de parrainage</h2>
                <p className="text-gray-600">Partagez ce code avec vos amis</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <code className="flex-1 bg-gray-100 p-4 rounded-lg text-lg font-mono">
                {profile?.referral_code || 'Chargement...'}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={copyReferralCode}
                title="Copier le code"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={shareReferralCode}
                title="Partager"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Comment ça marche ?</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Pour le filleul</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-900">
                    -20% sur le premier achat (abonnement ou match)
                  </p>
                </div>
                <p className="text-gray-600">
                  Votre ami bénéficie d'une réduction immédiate sur son premier achat
                  en utilisant votre code de parrainage lors de son inscription.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Pour vous (le parrain)</h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-900">
                    1 match illimité offert dès que votre filleul a un match
                  </p>
                </div>
                <p className="text-gray-600">
                  Vous recevez automatiquement votre récompense dès que votre filleul
                  réalise son premier match sur la plateforme.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Vos parrainages</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Filleuls inscrits</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Filleuls actifs</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Récompenses gagnées</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0€</div>
                <div className="text-sm text-gray-600">Économies générées</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}