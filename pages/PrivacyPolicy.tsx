import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Chez Mymate, nous prenons la protection de vos données personnelles très au sérieux. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre plateforme.
            </p>

            <h2>2. Informations que nous collectons</h2>
            <p>
              2.1 Informations que vous nous fournissez<br />
              Lorsque vous créez un compte, nous collectons votre adresse e-mail, votre mot de passe et le type d'utilisateur que vous sélectionnez (porteur de projet, chercheur de projet ou investisseur). Lors de la création de votre profil, nous collectons des informations supplémentaires telles que votre nom complet, votre localisation, votre biographie, vos compétences, votre expérience et vos préférences.
            </p>
            <p>
              2.2 Informations sur les projets<br />
              Si vous êtes un porteur de projet, nous collectons des informations sur vos projets, y compris le titre, la description, les compétences requises, le type de collaboration et d'autres détails pertinents.
            </p>
            <p>
              2.3 Informations de localisation<br />
              Avec votre consentement, nous collectons des informations sur votre localisation pour vous proposer des projets ou des talents à proximité.
            </p>
            <p>
              2.4 Informations d'utilisation<br />
              Nous collectons des informations sur la façon dont vous utilisez notre plateforme, y compris les pages que vous visitez, les actions que vous effectuez et les préférences que vous définissez.
            </p>

            <h2>3. Confidentialité des projets</h2>
            <p>
              3.1 Protection des informations sensibles<br />
              Nous comprenons l'importance de protéger les informations sensibles relatives aux projets. C'est pourquoi nous avons mis en place un système à deux niveaux :
            </p>
            <ul>
              <li>Les descriptions générales des projets sont visibles par tous les utilisateurs de la plateforme</li>
              <li>Les documents et informations détaillés ne sont accessibles qu'après un match mutuel entre le porteur de projet et le chercheur de projet ou l'investisseur</li>
            </ul>
            <p>
              3.2 Contrôle des accès<br />
              Les porteurs de projet ont un contrôle total sur qui peut accéder aux informations détaillées de leurs projets. Ils peuvent révoquer l'accès à tout moment.
            </p>

            <h2>4. Comment nous utilisons vos informations</h2>
            <p>
              Nous utilisons vos informations pour :
            </p>
            <ul>
              <li>Fournir, maintenir et améliorer notre plateforme</li>
              <li>Créer et gérer votre compte</li>
              <li>Vous mettre en relation avec des projets ou des talents pertinents</li>
              <li>Vous envoyer des notifications concernant les matches, les messages et les mises à jour</li>
              <li>Personnaliser votre expérience sur la plateforme</li>
              <li>Détecter et prévenir les fraudes et les abus</li>
            </ul>

            <h2>5. Partage des informations</h2>
            <p>
              5.1 Avec d'autres utilisateurs<br />
              Certaines informations de votre profil sont visibles par les autres utilisateurs de la plateforme. Les informations détaillées ne sont partagées qu'après un match mutuel.
            </p>
            <p>
              5.2 Avec des prestataires de services<br />
              Nous pouvons partager vos informations avec des prestataires de services tiers qui nous aident à fournir et à améliorer notre plateforme (par exemple, pour l'hébergement, l'analyse ou le service client).
            </p>
            <p>
              5.3 Pour des raisons légales<br />
              Nous pouvons partager vos informations si nous pensons de bonne foi que cela est nécessaire pour se conformer à la loi, protéger nos droits ou prévenir la fraude ou les abus.
            </p>

            <h2>6. Sécurité des données</h2>
            <p>
              Nous prenons des mesures techniques et organisationnelles appropriées pour protéger vos informations contre la perte, l'utilisation abusive et l'accès non autorisé, la divulgation, l'altération et la destruction.
            </p>

            <h2>7. Vos droits</h2>
            <p>
              Vous avez le droit d'accéder, de corriger, de mettre à jour ou de supprimer vos informations personnelles. Vous pouvez également vous opposer au traitement de vos informations ou demander une limitation de ce traitement.
            </p>

            <h2>8. Conservation des données</h2>
            <p>
              Nous conservons vos informations aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales. Si vous supprimez votre compte, nous supprimerons vos informations personnelles, sauf si nous devons les conserver pour des raisons légales.
            </p>

            <h2>9. Modifications de cette politique</h2>
            <p>
              Nous pouvons modifier cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement important en publiant la nouvelle politique sur notre plateforme ou en vous envoyant un e-mail.
            </p>

            <h2>10. Nous contacter</h2>
            <p>
              Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à privacy@mymate.com.
            </p>

            <p className="mt-8 text-sm text-gray-500">
              Dernière mise à jour : 9 avril 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}