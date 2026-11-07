# 🚀 Guide de Déploiement / Deployment Guide
## École Esprit Global (مدرسة العقل العالمي) 🎓

Ce projet est une plateforme éducative full-stack moderne dotée d'une architecture hybride :
- **Frontend** : React 18 + Vite + Framer Motion (animations de transition fluides, bilingue Arabe/Français/Anglais, Mobile-First).
- **Backend Node.js** : Express + `node:sqlite` / MySQL2 (API REST haute performance).
- **Backend PHP** : PHP 8.2+ PDO (compatible SQLite & MySQL, idéal pour cPanel/Apache/XAMPP).
- **Base de Données SQL** : Schémas unifiés MySQL & SQLite (`database/schema.sql`, `database/schema.mysql.sql`, `database/seed.sql`).

---

## 📋 Table des Matières
1. [Option 1 : Déploiement cPanel / Hébergement Mutualisé (PHP + MySQL + React)](#option-1--déploiement-cpanel--hébergement-mutualisé-php--mysql--react)
2. [Option 2 : Déploiement VPS avec Docker Compose (1-Click)](#option-2--déploiement-vps-avec-docker-compose-1-click)
3. [Option 3 : Déploiement Cloud (Vercel / Render / Railway)](#option-3--déploiement-cloud-vercel--render--railway)
4. [Option 4 : Développement Local (Windows / Mac / Linux)](#option-4--développement-local)
5. [Endpoints API & Schéma SQL](#endpoints-api--schéma-sql)

---

## Option 1 : Déploiement cPanel / Hébergement Mutualisé (PHP + MySQL + React)

Cette méthode est la plus répandue pour les écoles et les sites éducatifs au Maroc et dans le monde arabe.

### Étape 1 : Compiler le Frontend React
Sur votre machine locale, lancez la compilation :
```bash
npm run build
```
Le dossier généré se trouve dans `client/dist/`. Il contient l'application React, les assets, les cours, et le fichier `.htaccess` pour gérer le routage SPA.

### Étape 2 : Créer la Base de Données MySQL sur cPanel
1. Connectez-vous à votre panneau **cPanel**.
2. Allez dans **Bases de données MySQL** (MySQL Databases).
3. Créez une nouvelle base (ex: `ecole_global`).
4. Créez un utilisateur MySQL avec un mot de passe sécurisé et attribuez-lui **tous les privilèges** sur la base.
5. Ouvrez **phpMyAdmin**, sélectionnez votre base de données et importez successivement :
   - `database/schema.mysql.sql`
   - `database/seed.sql`

### Étape 3 : Uploader les Fichiers
1. Dans le **Gestionnaire de fichiers** (File Manager) de cPanel, allez dans `public_html/`.
2. Déposez tout le contenu de `client/dist/` à la racine de `public_html/`.
3. Déposez le dossier `php-server/` sous `public_html/api/` (ou copiez les fichiers de `php-server/public/` dans `public_html/api/`).
4. Modifiez `php-server/config.php` ou créez un fichier `php-server/.env` avec vos accès MySQL :
   ```env
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=ecole_global
   DB_USER=votre_utilisateur
   DB_PASSWORD=votre_mot_de_passe
   ```

Votre site est maintenant en ligne !

---

## Option 2 : Déploiement VPS avec Docker Compose (1-Click)

Idéal pour les serveurs dédiés ou VPS (Ubuntu, Debian, AlmaLinux, DigitalOcean, Hetzner, AWS EC2).

### Prérequis
- Docker et Docker Compose installés sur le serveur.

### Commandes de Déploiement
1. Clonez le projet sur votre serveur :
   ```bash
   git clone <URL_DU_DEPOT>
   cd Global-Mind
   ```

2. Lancez tous les conteneurs en tâche de fond :
   ```bash
   docker compose up -d --build
   ```

3. Docker va automatiquement démarrer :
   - `ecole-mysql` : Base de données MySQL 8 (port 3307 ou interne).
   - `ecole-node-api` : Backend Express (port 5000).
   - `ecole-php-api` : Backend PHP 8.2 Apache (port 8000).
   - `ecole-client` : Frontend React servi par Nginx (port 80 et 3000) avec reverse proxy pour `/api`.

4. Pour vérifier l'état des conteneurs :
   ```bash
   docker compose ps
   docker compose logs -f
   ```

---

## Option 3 : Déploiement Cloud (Vercel / Render / Railway)

### 1. Frontend React sur Vercel ou Netlify
- **Root Directory** : `client`
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
- Les fichiers `_redirects` et `_headers` sont déjà configurés pour Netlify et Vercel.

### 2. Backend Node.js sur Render ou Railway
- **Root Directory** : `server`
- **Build Command** : `npm install`
- **Start Command** : `node src/index.js`
- **Variables d'environnement** :
  - `PORT` : `5000`
  - `DB_TYPE` : `sqlite` (ou `mysql`)

---

## Option 4 : Développement Local

### Prérequis
- Node.js (v20 ou supérieur recommandé, v24 supporté).
- PHP (v8.1 ou supérieur avec extensions `pdo_mysql` et `pdo_sqlite`).

### Lancement avec Node.js + React :
```bash
# Installe les dépendances
npm install

# Lance le frontend React (port 3000) et le backend Express (port 5000)
npm run dev
```

### Lancement avec PHP + React :
```bash
# Lance le frontend React (port 3000) et le backend PHP (port 8000)
npm run dev:php
```

### Lancement de tous les serveurs simultanément :
```bash
npm run dev:all
```

---

## 📡 Endpoints API & Schéma SQL

Les deux backends (Node.js et PHP) exposent les mêmes routes REST standardisées :

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Vérification de l'état de santé du serveur |
| `GET` | `/api/lessons` | Liste hiérarchique de toutes les matières, leçons et exercices |
| `POST` | `/api/contact` | Envoi d'un message de contact avec protection anti-spam Honeypot |
| `POST` | `/api/scores` | Enregistrement du score et des étoiles d'un élève dans la table SQL `scores` |
| `GET` | `/api/scores?limit=10` | Récupération des derniers scores et du tableau d'honneur |
| `GET` | `/api/stats` | Statistiques globales (leçons, quiz, étoiles obtenues, messages reçus) |

### Tables SQL :
1. `subjects` : Les 4 matières (Arabe, Mathématiques, Français, Sciences).
2. `lessons` : Les leçons avec contenus, vidéos, images et liens PDF.
3. `lesson_words` : Grille de vocabulaire français avec emojis et prononciation audio.
4. `quizzes` : Questions QCM interactives avec options, bonne réponse et explications.
5. `contacts` : Messages envoyés via le formulaire de contact.
6. `scores` : Résultats et étoiles obtenus par les élèves.
