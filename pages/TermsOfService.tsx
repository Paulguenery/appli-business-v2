import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function TermsOfService() {
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
          <h1 className="text-3xl font-bold">Conditions d'utilisation</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none">
            <h2>1. Acceptation des conditions</h2>
            <p>
              En accédant et en utilisant la plateforme Mymate, vous acceptez d'être lié par les présentes conditions d'utilisation, toutes les lois et réglementations applicables, et vous acceptez que vous êtes responsable du respect des lois locales applicables. Si vous n'acceptez pas l'une de ces conditions, vous n'êtes pas autorisé à utiliser ou à accéder à cette plateforme.
            </p>

            <h2>2. Confidentialité des projets</h2>
            <p>
              2.1 Protection des informations sensibles<br />
              Mymate s'engage à protéger la confidentialité des projets publiés sur la plateforme. Les informations détaillées concernant les projets ne sont accessibles qu'après un match mutuel entre le porteur de projet et le chercheur de projet ou l'investisseur.
            </p>
            <p>
              2.2 Accès aux documents confidentiels<br />
              Les documents détaillés des projets (business plans, spécifications techniques, etc.) ne sont accessibles qu'après un match et peuvent être soumis à des conditions supplémentaires définies par le porteur de projet.
            </p>
            <p>
              2.3 Engagement de non-divulgation<br />
              En accédant aux informations détaillées d'un projet, vous vous engagez à ne pas divulguer ces informations à des tiers sans l'autorisation expresse du porteur de projet.
            </p>

            <h2>3. Utilisation de la licence</h2>
            <p>
              L'autorisation d'utiliser temporairement la plateforme Mymate est accordée, et cette autorisation peut être révoquée par Mymate à tout moment pour quelque raison que ce soit.
            </p>

            <h2>4. Clause de non-responsabilité</h2>
            <p>
              Les informations sur la plateforme Mymate sont fournies "telles quelles". Mymate ne donne aucune garantie, expresse ou implicite, et décline par la présente toute garantie, y compris, sans limitation, les garanties implicites ou les conditions de qualité marchande, d'adéquation à un usage particulier, ou de non-violation de la propriété intellectuelle ou autre violation des droits.
            </p>

            <h2>5. Limitations</h2>
            <p>
              En aucun cas, Mymate ou ses fournisseurs ne seront responsables de tout dommage (y compris, sans limitation, les dommages pour perte de données ou de profit, ou en raison d'une interruption d'activité) découlant de l'utilisation ou de l'impossibilité d'utiliser les informations sur la plateforme Mymate, même si Mymate ou un représentant autorisé de Mymate a été informé oralement ou par écrit de la possibilité de tels dommages.
            </p>

            <h2>6. Révisions et errata</h2>
            <p>
              Les informations sur la plateforme Mymate peuvent contenir des inexactitudes techniques ou des erreurs typographiques. Mymate se réserve le droit de modifier les informations contenues sur sa plateforme à tout moment sans préavis.
            </p>

            <h2>7. Liens</h2>
            <p>
              Mymate n'a pas examiné tous les sites liés à sa plateforme et n'est pas responsable du contenu de ces sites liés. L'inclusion de tout lien n'implique pas l'approbation par Mymate du site. L'utilisation de tout site web lié est aux risques et périls de l'utilisateur.
            </p>

            <h2>8. Modifications des conditions d'utilisation</h2>
            <p>
              Mymate peut réviser ces conditions d'utilisation de sa plateforme à tout moment sans préavis. En utilisant cette plateforme, vous acceptez d'être lié par la version actuelle de ces conditions d'utilisation.
            </p>

            <h2>9. Loi applicable</h2>
            <p>
              Toute réclamation relative à la plateforme Mymate sera régie par les lois françaises, sans égard aux dispositions relatives aux conflits de lois.
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