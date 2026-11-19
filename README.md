# Helpjs — Hesias Helpdesk

Application de gestion des tickets de support développée dans le cadre du projet Node.js 4NOD d'HESIAS.

L'application permettra aux utilisateurs de créer et suivre des tickets, aux techniciens de traiter les incidents et aux administrateurs de gérer les comptes.

## 1. Prérequis

Pour installer le projet, disposer de :

- Git
- Docker Engine
- Docker Compose

Node.js 24+ et npm sont nécessaires uniquement pour exécuter directement les outils sur la machine, hors conteneur.

## 2. Récupération du projet

Cloner la branche principale :

```bash
git clone --branch main https://github.com/Loxime/helpjs.git
cd helpjs
```

Pour actualiser un dépôt déjà cloné, depuis une branche `main` sans modifications locales :

```bash
git pull --ff-only origin main
```

## 3. Configuration des variables d'environnement

**À mettre en place :** après la création du fichier `.env.example`, initialiser la configuration locale avec :

```bash
cp .env.example .env
```

Les variables prévues comprennent :

- `DATABASE_URL` : chemin de la base SQLite utilisée par Prisma.
- `JWT_SECRET` : secret privé pour la signature des jetons d'authentification.

Le fichier `.env` doit être configuré localement et ne doit jamais être publié sur Git.

### Configuration automatisée (prévue)

Une commande `npm run setup:demo` sera ajoutée pour faciliter la préparation de l'environnement local, des migrations et des données de démonstration.

**Cette commande sera réservée aux développeurs et aux évaluateurs souhaitant préparer rapidement une installation de démonstration.** Elle ne devra pas être utilisée pour initialiser une production contenant des données réelles.

## 4. Construction et lancement

La construction Docker est déjà opérationnelle :

```bash
docker compose build
```

Pour vérifier les dépendances installées :

```bash
docker compose run --rm app npm ls --depth=0
```

**Lancement prévu après la création du serveur Express et la configuration du port :**

```bash
docker compose up --build
```

L'application sera alors accessible à l'adresse prévue :

**http://localhost:3000**

Pour arrêter les services :

```bash
docker compose down
```

## 5. Tests

Le projet adopte le développement piloté par les tests (TDD).

La commande `npm test` sera configurée lors de la mise en place de l'environnement de tests. Les tests couvriront notamment l'API, les permissions et les règles métier.

## 6. Comptes de démonstration

Un seed Prisma sera prévu avec au moins un compte de chaque rôle :

- `USER` : utilisateur.
- `TECH` : technicien.
- `ADMIN` : administrateur.

Les identifiants et mots de passe de démonstration seront renseignés ici après la création du seed. Ils ne devront pas être réutilisés en production.

## 7. Documentation

Les choix architecturaux, les conventions de développement et la stratégie de tests sont décrits dans [DOCUMENTATION.md](DOCUMENTATION.md).

**État actuel :** configuration Git, npm et Docker fonctionnelle. Serveur applicatif, base de données et lancement complet encore à implémenter.