# Documentation technique — Helpjs

## 1. Objectifs

Le projet Helpjs repose sur quatre principes :

1. Versionner les évolutions avec Git.
2. Isoler et reproduire l'environnement avec Docker.
3. Organiser le code selon les principes de responsabilité unique et de Clean Architecture.
4. Développer les fonctionnalités par une approche TDD (*Test-Driven Development*).

L'objectif est de construire une application lisible, maintenable, testable et dont les décisions techniques peuvent être expliquées.

## 2. Gestion des versions — Git

Git est utilisé pour suivre l'évolution du projet, conserver son historique et revenir à un état antérieur si nécessaire.

La branche `main` contient l'état de référence du projet.

Les modifications sont regroupées en commits cohérents :

- `chore` : configuration, dépendances et infrastructure.
- `feat` : nouvelle fonctionnalité.
- `fix` : correction d'un défaut.
- `test` : ajout ou évolution des tests.
- `docs` : documentation.
- `refactor` : réorganisation sans changement de comportement.

Chaque étape doit être vérifiée avant d'être intégrée.

## 3. Environnement — Docker

Docker permet d'exécuter les services dans un environnement isolé et reproductible, indépendamment des installations locales des développeurs.

Docker Compose définit les services, les volumes et les paramètres d'exécution.

### Organisation retenue

- Un conteneur applicatif Node.js 24.
- Un volume dédié aux dépendances `node_modules`.
- Un montage du code source pour le développement.
- Une base SQLite persistante à configurer avec Prisma.

SQLite étant une base embarquée, aucun conteneur de base de données distinct n'est nécessaire.

Les fichiers `Dockerfile`, `compose.yaml` et `.dockerignore` sont versionnés.

## 4. Architecture applicative

L'organisation reprend les conventions du projet HesiasShortener fourni en cours.

### Structure cible

```text
src/
├── app.js
├── server.js
├── db.js
├── socket.js
├── HttpError.js
├── routes/
├── services/
├── middlewares/
└── schemas/

prisma/
public/
views/
tests/
```

### Répartition des responsabilités

| Composant | Responsabilité |
|---|---|
| `app.js` | Configurer Express et ses routes |
| `server.js` | Démarrer le serveur HTTP |
| `routes/` | Recevoir les requêtes et produire les réponses |
| `services/` | Appliquer les règles métier et orchestrer les opérations |
| `middlewares/` | Traiter les préoccupations HTTP transversales |
| `schemas/` | Définir les validations Zod |
| `db.js` | Centraliser l'accès au client Prisma |
| `socket.js` | Organiser les échanges temps réel |
| `views/` | Produire les interfaces EJS |
| `tests/` | Vérifier les comportements attendus |

### Clean Architecture pragmatique

Nous appliquons la séparation des responsabilités sans imposer de couches supplémentaires inutiles.

Le parcours habituel d'une requête est :

**Requête HTTP → middleware → route → service → Prisma → SQLite**

Les règles métier doivent rester indépendantes du rendu EJS et, autant que possible, des objets HTTP Express.

Un service doit posséder une responsabilité clairement identifiable. Les services seront organisés autour des besoins métier réels et non découpés artificiellement.

### Contrats et interfaces testables

JavaScript ne fournit pas d'interfaces natives comparables à celles de TypeScript.

Nous privilégierons donc :

- Des fonctions aux entrées et sorties clairement définies.
- Des dépendances injectables lorsqu'elles facilitent effectivement les tests.
- Des doublures de test pour isoler certains composants.
- Des tests d'intégration pour vérifier le comportement réel d'Express et de Prisma.
- Des interfaces EJS pour contrôler manuellement les parcours utilisateurs.

L'introduction de nouvelles abstractions devra rester justifiée par un besoin concret.

## 5. Développement piloté par les tests — TDD

Le développement suit le cycle **Red → Green → Refactor**.

### Red — Définir le comportement

Écrire un test décrivant une règle ou un résultat attendu avant son implémentation.

Le test doit échouer pour la raison attendue.

### Green — Implémenter

Écrire le code minimum nécessaire pour satisfaire le test.

### Refactor — Améliorer

Améliorer la lisibilité et l'organisation sans modifier le comportement validé.

Relancer les tests après chaque changement.

### Outils de référence

- `node:test` : exécution des tests.
- `node:assert/strict` : vérification des résultats.
- Supertest : tests HTTP de l'application Express.

### Priorités de tests

Les vérifications porteront notamment sur :

- L'authentification et les autorisations.
- La création et la consultation des tickets.
- Les transitions autorisées entre statuts.
- Les restrictions d'accès aux tickets.
- La validation des données entrantes.
- Les réponses et codes HTTP.
- Les échanges Socket.IO et leurs permissions.

Chaque fonctionnalité doit satisfaire ses tests avant d'être considérée comme terminée.

## 6. Sécurité des échanges

La sécurité est intégrée dès la conception, sur les pages, l'API JSON et les connexions temps réel.

### Authentification

- Mots de passe hachés, jamais stockés en clair.
- JWT transmis dans un cookie `httpOnly`.
- Vérification de l'authentification côté serveur.
- Protection des routes contre les tentatives répétées de connexion.

### Autorisations

Les rôles `USER`, `TECH` et `ADMIN` disposent de permissions différentes.

Ces permissions doivent être contrôlées côté serveur, indépendamment des éléments visibles dans l'interface.

Les accès aux tickets et les transitions de statut doivent respecter les règles métier.

### Validation

Zod valide les données provenant des requêtes et les données reçues via Socket.IO lorsque nécessaire.

Les messages d'erreur ne doivent pas divulguer de secrets ni de détails internes sensibles.

### Protection des communications

- HTTPS sera requis pour une exposition en production.
- Les cookies devront être configurés avec des attributs de sécurité adaptés.
- Les actions authentifiées par cookie devront être protégées contre les attaques CSRF.
- Chaque connexion Socket.IO et chaque accès à une ressource devront respecter les permissions applicables.

## 7. Critères de qualité

Une fonctionnalité est considérée comme prête lorsque :

- Son comportement répond au besoin défini.
- Les règles métier sont vérifiées côté serveur.
- Les entrées sont validées.
- Les erreurs sont correctement traitées.
- Les tests correspondants réussissent.
- Le code reste compréhensible sans duplication inutile.
- Les choix techniques peuvent être expliqués.

## 8. Évolution des décisions

Ce document sera actualisé à mesure que les éléments architecturaux seront réellement implémentés et validés.

Les fonctionnalités, les scripts automatisés et les mécanismes de sécurité décrits comme des objectifs ne sont pas considérés comme opérationnels tant qu'ils n'ont pas été développés et vérifiés.