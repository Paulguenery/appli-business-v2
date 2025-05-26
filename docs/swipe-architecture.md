# 🧭 Architecture des systèmes de swipe

L'application repose sur trois systèmes de swipe totalement isolés :

- `ProjectSeekerSwipe` : pour les chercheurs de projet
- `ProjectOwnerSwipe` : pour les porteurs de projet
- `InvestorSwipe` : pour les investisseurs

## 🔨 Structure du code

```
components/
  swipe/
    ProjectSeekerSwipe.tsx
    ProjectOwnerSwipe.tsx
    InvestorSwipe.tsx
    ProjectSeekerCard.tsx
    ProjectOwnerCard.tsx
    InvestorCard.tsx
    UserTypeSwipeRouter.tsx
logic/
  projectSeekerSwipeLogic.ts
  projectOwnerSwipeLogic.ts
  investorSwipeLogic.ts
utils/
  swipeHelpers.ts
__tests__/
  swipe/
    ProjectSeekerSwipe.test.tsx
    ProjectOwnerSwipe.test.tsx
    InvestorSwipe.test.tsx
    integration.test.tsx
```

## 🔄 Flux de données

Chaque système de swipe suit le même modèle de flux de données, mais avec des implémentations totalement indépendantes :

1. **Récupération des données** : Chaque système a sa propre fonction pour récupérer les données pertinentes
   - `fetchProjects` pour les chercheurs de projet
   - `fetchTalents` pour les porteurs de projet
   - `fetchInvestmentOpportunities` pour les investisseurs

2. **Filtrage des données** : Chaque système a sa propre logique de filtrage
   - `filterProjects` pour les chercheurs de projet
   - `filterTalents` pour les porteurs de projet
   - `filterInvestmentOpportunities` pour les investisseurs

3. **Gestion des swipes** : Chaque système a sa propre logique de gestion des swipes
   - `handleProjectSwipe` pour les chercheurs de projet
   - `handleTalentSwipe` pour les porteurs de projet
   - `handleInvestmentSwipe` pour les investisseurs

## 🔄 Avantages de cette architecture

- **Modularité et évolutivité** : Chaque système peut évoluer indépendamment
- **Facilité de maintenance** : Les modifications sur un système n'affectent pas les autres
- **Réduction des risques de régression** : Les tests isolés garantissent la non-interférence
- **Clarté du code** : Chaque système a une responsabilité unique et bien définie

## ✅ Tests de non-interférence

- Chaque composant peut être supprimé sans affecter les autres
- Mock complet des dépendances externes
- Tests d'intégration pour valider le routing, le rendering et les interactions utilisateur

## 🔄 Routage

Le routage est géré par le composant `UserTypeSwipeRouter` qui affiche le bon système de swipe en fonction du type d'utilisateur connecté :

```tsx
switch (user.user_type) {
  case 'project_owner':
    return <ProjectOwnerSwipe />;
  case 'project_seeker':
    return <ProjectSeekerSwipe />;
  case 'investor':
    return <InvestorSwipe />;
  default:
    return <FallbackComponent />;
}
```

## 🔄 Utilitaires partagés

Les seules fonctions partagées entre les systèmes sont des utilitaires génériques qui ne créent pas de dépendances fonctionnelles :

- `logSwipeHistory` : Enregistre l'historique des swipes
- `getCurrentUserProfileId` : Récupère l'ID du profil de l'utilisateur connecté
- `calculateDistance` : Calcule la distance entre deux points géographiques

Ces utilitaires sont regroupés dans `swipeHelpers.ts` et sont conçus pour être utilisés de manière indépendante.