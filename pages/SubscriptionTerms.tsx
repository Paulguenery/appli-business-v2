import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function SubscriptionTerms() {
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
          <h1 className="text-3xl font-bold">Conditions Générales de Vente</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none">
            <h2>1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre la société Mymate, ci-après dénommée "le Prestataire", et toute personne physique ou morale, ci-après dénommée "le Client", souhaitant souscrire à un abonnement ou effectuer un achat sur la plateforme Mymate.
            </p>

            <h2>2. Description des services</h2>
            <p>
              Mymate propose différentes formules d'abonnement permettant d'accéder à des fonctionnalités avancées de mise en relation entre porteurs de projets, chercheurs de projets et investisseurs. Les caractéristiques essentielles des services proposés sont présentées sur la page d'abonnement de la plateforme.
            </p>

            <h3>2.1 Formules d'abonnement pour les porteurs de projet</h3>
            <ul>
              <li>Freemium : Accès limité aux fonctionnalités de base</li>
              <li>Starter : Accès à des fonctionnalités intermédiaires</li>
              <li>Premium Pro : Accès à l'ensemble des fonctionnalités</li>
            </ul>

            <h3>2.2 Formules d'abonnement pour les chercheurs de projet</h3>
            <ul>
              <li>Freemium : Accès limité aux fonctionnalités de base</li>
              <li>Pay-per-conversation : Paiement à l'unité pour chaque conversation débloquée</li>
              <li>Standard : Accès à des fonctionnalités intermédiaires</li>
              <li>Premium+ : Accès à l'ensemble des fonctionnalités</li>
            </ul>

            <h3>2.3 Formules d'abonnement pour les investisseurs</h3>
            <ul>
              <li>Basic : Accès limité aux fonctionnalités de base</li>
              <li>Investisseur Pro : Accès à l'ensemble des fonctionnalités</li>
            </ul>

            <h2>3. Prix et modalités de paiement</h2>
            <p>
              Les prix des abonnements sont indiqués en euros et toutes taxes comprises (TTC). Le Prestataire se réserve le droit de modifier ses prix à tout moment, mais les abonnements seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
            </p>
            <p>
              Le paiement s'effectue par carte bancaire via une interface de paiement sécurisée. L'abonnement est renouvelé automatiquement à la fin de chaque période, sauf résiliation par le Client dans les conditions prévues à l'article 5.
            </p>

            <h2>4. Durée de l'abonnement</h2>
            <p>
              Les abonnements sont souscrits pour une durée d'un mois, renouvelable tacitement pour des périodes de même durée, sauf résiliation par le Client dans les conditions prévues à l'article 5.
            </p>
            <p>
              Pour la formule Pay-per-conversation, l'achat est définitif et permet de débloquer une conversation spécifique sans limitation de durée.
            </p>

            <h2>5. Résiliation</h2>
            <p>
              Le Client peut résilier son abonnement à tout moment depuis son espace personnel sur la plateforme. La résiliation prendra effet à la fin de la période d'abonnement en cours, sans remboursement prorata temporis.
            </p>
            <p>
              Le Prestataire se réserve le droit de résilier l'abonnement du Client en cas de non-respect des présentes CGV, sans préjudice de tous dommages et intérêts que le Prestataire serait en droit de réclamer.
            </p>

            <h2>6. Droit de rétractation</h2>
            <p>
              Conformément aux dispositions légales en vigueur, le Client dispose d'un délai de 14 jours à compter de la souscription de l'abonnement pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
            </p>
            <p>
              Pour exercer ce droit, le Client doit notifier sa décision de rétractation par email à l'adresse support@mymate.com. Le remboursement sera effectué dans un délai de 14 jours à compter de la date à laquelle le Prestataire est informé de la décision du Client de se rétracter.
            </p>
            <p>
              Toutefois, si le Client a commencé à utiliser le service avant la fin du délai de rétractation, il reconnaît que son droit de rétractation est perdu.
            </p>

            <h2>7. Responsabilité</h2>
            <p>
              Le Prestataire s'engage à mettre en œuvre tous les moyens nécessaires pour assurer un accès continu et de qualité à la plateforme. Toutefois, il ne saurait être tenu responsable des difficultés ou impossibilités momentanées d'accès qui auraient pour origine des circonstances qui lui sont extérieures ou des cas de force majeure.
            </p>
            <p>
              Le Prestataire ne peut garantir l'exactitude et la pertinence des informations fournies par les utilisateurs de la plateforme. Il ne saurait être tenu responsable des conséquences directes ou indirectes pouvant résulter de l'utilisation, la consultation ou l'interprétation des informations fournies.
            </p>

            <h2>8. Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments constituant la plateforme Mymate (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, noms, logos, marques, créations et œuvres protégeables diverses, bases de données, etc.) sont la propriété exclusive du Prestataire ou font l'objet d'une autorisation d'utilisation. Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, de tout ou partie de ces éléments, sans l'accord préalable et écrit du Prestataire, est strictement interdite.
            </p>

            <h2>9. Protection des données personnelles</h2>
            <p>
              Le Prestataire s'engage à respecter la confidentialité des données personnelles communiquées par le Client et à les traiter dans le respect de la législation en vigueur. Pour plus d'informations sur la gestion des données personnelles, veuillez consulter notre Politique de Confidentialité.
            </p>

            <h2>10. Loi applicable et juridiction compétente</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
            </p>

            <h2>11. Service client</h2>
            <p>
              Pour toute question relative aux présentes CGV ou aux services proposés, le Client peut contacter le service client à l'adresse email suivante : support@mymate.com.
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