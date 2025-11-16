export default function CgvCguPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 font-playfair text-center">
          Conditions Générales de Vente et d'Utilisation
        </h1>

        {/* CGV */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 font-playfair text-primary">
            Conditions Générales de Vente (CGV)
          </h2>
          
          <p className="mb-6 text-gray-700">
            Il est préalablement précisé que les présentes conditions régissent exclusivement les ventes par la boutique Atypikhouse, propriété de la SARL Atypikhouse, Société à Responsabilité Limitée au capital de 10 000 €, RCS 6543876598, dont le siège est situé au 123 Rue des Hirondelles, 60123 Pierrefonds, France.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">1. Objet</h3>
          <p className="mb-6 text-gray-700">
            Les présentes CGV ont pour objet de définir les conditions dans lesquelles Atypikhouse propose à la location des habitations insolites. Toute réservation implique l'acceptation sans réserve des présentes CGV par le Locataire.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">2. Descriptions des hébergements</h3>
          <p className="mb-4 text-gray-700">
            Les hébergements proposés par Atypikhouse sont des habitations insolites, à savoir :
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-700 ml-4">
            <li>Cabanes dans les arbres</li>
            <li>Yourtes</li>
            <li>Cabanes flottantes</li>
            <li>Tentes suspendues et autres habitations atypiques</li>
          </ul>
          <p className="mb-6 text-gray-700">
            Les caractéristiques des hébergements, telles que leur capacité d'accueil, les équipements fournis, et les services proposés, sont indiquées dans les fiches descriptives présentes sur le site internet d'Atypikhouse.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">3. Conditions de réservation</h3>
          <h4 className="text-xl font-semibold mb-3 text-gray-800">3.1 Modalités de réservation</h4>
          <p className="mb-4 text-gray-700">
            Les réservations peuvent être effectuées en ligne via le site internet d'Atypikhouse ou par tout autre moyen de communication mis à disposition. La réservation n'est validée qu'après le paiement d'un acompte ou de la totalité de la location.
          </p>

          <h4 className="text-xl font-semibold mb-3 text-gray-800">3.2 Validation de la réservation</h4>
          <p className="mb-4 text-gray-700">
            La réservation est confirmée après réception d'une confirmation écrite par email de la part d'Atypikhouse, accompagnée du paiement d'un acompte correspondant à 30% du montant total de la location.
          </p>

          <h4 className="text-xl font-semibold mb-3 text-gray-800">3.3 Annulation par le Locataire</h4>
          <p className="mb-3 text-gray-700">Les modalités d'annulation sont les suivantes :</p>
          <ul className="list-disc list-inside mb-6 text-gray-700 ml-4">
            <li>Annulation plus de 30 jours avant la date d'arrivée : remboursement intégral</li>
            <li>Annulation entre 15 et 30 jours avant la date d'arrivée : remboursement de 50% du montant total de la location</li>
            <li>Annulation moins de 15 jours avant la date d'arrivée : aucun remboursement ne sera effectué</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">4. Tarifs et conditions de paiement</h3>
          <h4 className="text-xl font-semibold mb-3 text-gray-800">4.1 Tarifs</h4>
          <p className="mb-4 text-gray-700">
            Les tarifs des locations sont affichés en euros, toutes taxes comprises (TTC), et varient en fonction de la saison, de la durée du séjour, et des promotions éventuelles.
          </p>

          <h4 className="text-xl font-semibold mb-3 text-gray-800">4.2 Modalités de paiement</h4>
          <p className="mb-3 text-gray-700">Les moyens de paiement acceptés incluent :</p>
          <ul className="list-disc list-inside mb-4 text-gray-700 ml-4">
            <li>Carte bancaire</li>
            <li>Virement bancaire</li>
            <li>Chèque (sur accord préalable)</li>
            <li>Autres moyens spécifiés sur le site d'Atypikhouse</li>
          </ul>
          <p className="mb-6 text-gray-700">
            Un acompte de 30% est requis à la réservation, et le solde doit être réglé au plus tard 15 jours avant le début du séjour.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">5. Caution</h3>
          <p className="mb-6 text-gray-700">
            Le Propriétaire peut demander une caution, dont le montant est spécifié au moment de la réservation. Cette caution est destinée à couvrir d'éventuels dommages causés à l'hébergement. Elle est restituée dans un délai de 10 jours après l'état des lieux de sortie, déduction faite des réparations éventuelles.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">6. Arrivée et départ</h3>
          <h4 className="text-xl font-semibold mb-3 text-gray-800">6.1 Heures d'arrivée</h4>
          <p className="mb-4 text-gray-700">
            Les arrivées sont possibles à partir de 16h00, sauf mention contraire.
          </p>

          <h4 className="text-xl font-semibold mb-3 text-gray-800">6.2 Heures de départ</h4>
          <p className="mb-6 text-gray-700">
            Les départs doivent avoir lieu avant 11h00. Tout départ tardif sans accord préalable peut entraîner des frais supplémentaires.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">7. Utilisation de l'hébergement</h3>
          <p className="mb-6 text-gray-700">
            Le Locataire s'engage à respecter l'hébergement et à l'utiliser de manière appropriée. Toute dégradation ou dommage causé à l'hébergement sera déduit de la caution. Le Locataire s'engage également à respecter les règles spécifiques indiquées par le Propriétaire, telles que celles relatives aux nuisances sonores ou à l'usage des installations.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">8. Responsabilité</h3>
          <h4 className="text-xl font-semibold mb-3 text-gray-800">8.1 Responsabilité du Loueur</h4>
          <p className="mb-4 text-gray-700">
            Atypikhouse agit en tant qu'intermédiaire et ne pourra être tenu responsable en cas de litige entre le Propriétaire et le Locataire, ou en cas de non-conformité de l'hébergement par rapport à la description fournie.
          </p>

          <h4 className="text-xl font-semibold mb-3 text-gray-800">8.2 Responsabilité du Propriétaire</h4>
          <p className="mb-6 text-gray-700">
            Le Propriétaire est responsable de la conformité de l'hébergement et de son état de propreté à l'arrivée du Locataire. Le Propriétaire s'engage à rembourser le Locataire en cas de manquement grave à ces obligations.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">9. Assurance</h3>
          <p className="mb-6 text-gray-700">
            Le Propriétaire est tenu de souscrire une assurance couvrant les risques locatifs. Il est également recommandé au Locataire de souscrire une assurance « villégiature » pour se protéger en cas de dommages matériels ou corporels survenant pendant son séjour.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">10. Animaux</h3>
          <p className="mb-6 text-gray-700">
            La présence d'animaux doit être signalée lors de la réservation et est soumise à l'autorisation du Propriétaire. Des frais supplémentaires peuvent être appliqués pour la présence d'animaux.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">11. Force majeure</h3>
          <p className="mb-6 text-gray-700">
            Aucun des contractants ne pourra être tenu responsable en cas d'inexécution ou de retard dans l'exécution de ses obligations en raison d'un cas de force majeure (catastrophes naturelles, pandémie, conditions météorologiques extrêmes, etc.).
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">12. Service Après-Vente</h3>
          <p className="mb-6 text-gray-700">
            AtypikHouse s'engage à fournir un service après-vente de qualité pour répondre aux besoins de ses clients. En cas de problème, de réclamation ou d'assistance nécessaire concernant votre location, veuillez contacter notre équipe de support client à l'adresse électronique ou au numéro de téléphone indiqué sur notre site Internet. Nous mettrons tout en œuvre pour vous aider dans les plus brefs délais.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">13. Réclamations</h3>
          <p className="mb-6 text-gray-700">
            En cas de litige ou de réclamation concernant un hébergement, le Locataire est invité à contacter Atypikhouse dans les 48 heures suivant l'arrivée. Si aucune solution amiable n'est trouvée, le litige pourra être soumis aux juridictions compétentes selon la législation française.
          </p>
        </section>

        {/* CGU */}
        <section className="mb-12 border-t pt-12">
          <h2 className="text-3xl font-bold mb-6 font-playfair text-primary">
            Conditions Générales d'Utilisation (CGU)
          </h2>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">1. Objet</h3>
          <p className="mb-6 text-gray-700">
            Les présentes conditions régissent l'utilisation du site web d'AtypikHouse.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">2. Acceptation des conditions</h3>
          <p className="mb-6 text-gray-700">
            En utilisant le site web d'AtypikHouse, l'utilisateur reconnaît avoir lu, compris et accepté les présentes CGU.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">3. Accès au site</h3>
          <p className="mb-6 text-gray-700">
            AtypikHouse se réserve le droit de modifier, suspendre ou interrompre l'accès à tout ou partie du site à tout moment, pour n'importe quelle raison, et sans préavis.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">4. Propriété intellectuelle</h3>
          <p className="mb-6 text-gray-700">
            Tout le contenu présent sur le site web d'AtypikHouse, y compris, mais sans s'y limiter, les textes, les graphiques, les logos, les images, est la propriété d'AtypikHouse et est protégé par le droit d'auteur.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-900">5. Responsabilités</h3>
          <p className="mb-6 text-gray-700">
            AtypikHouse ne peut être tenu responsable des dommages de toute nature résultant de l'utilisation de son site.
          </p>
        </section>

        <div className="text-center text-gray-600 text-sm">
          <p>Dernière mise à jour : Novembre 2024</p>
          <p className="mt-2">© 2024 AtypikHouse SARL - Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}
