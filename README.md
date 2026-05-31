# 🌾 TogoAgric — Plateforme Agricole du Togo

<p align="center">
  <img src="https://img.shields.io/badge/Version-11.0-brightgreen" alt="Version">
  <img src="https://img.shields.io/badge/Licence-MIT-blue" alt="Licence">
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6" alt="TypeScript">
  <img src="https://img.shields.io/badge/Langues-FR%20%7C%20Éwé%20%7C%20Kabyè-green" alt="Langues">
</p>

---

## 📖 Présentation

**TogoAgric** est la première plateforme agricole en ligne dédiée au Togo, conçue pour connecter les agriculteurs, les acheteurs et les acteurs de la filière agroalimentaire. La plateforme centralise les prix des produits agricoles en temps réel, les prévisions météorologiques, un marketplace pour les transactions et un forum communautaire pour les échanges de connaissances.

TogoAgric vise à moderniser la chaîne de valeur agricole togolaise en donnant aux agriculteurs les outils numériques nécessaires pour prendre de meilleures décisions de vente, accéder aux informations météorologiques et communiquer directement avec les acheteurs, le tout dans les trois langues nationales du Togo : le français, l'éwé et le kabyè.

---

## 👤 Fondateur & Contact

| Information | Détails |
|---|---|
| **Fondateur** | KOUMEKPO Ablam |
| **Téléphone** | 96327992 |
| **Email** | koumekpoablam3@gmail.com |

---

## 🛠️ Stack Technologique

| Technologie | Utilisation |
|---|---|
| **Next.js 16** (App Router) | Framework React full-stack avec rendu côté serveur et client |
| **TypeScript** | Typage statique pour une meilleure fiabilité du code |
| **Tailwind CSS 4** | Framework CSS utilitaire pour un design responsive et moderne |
| **JSON (données intégrées)** | Couche de données légère sans dépendance de base de données |
| **Open-Meteo API** | Données météorologiques en temps réel (aucune clé API requise) |
| **Lucide React** | Bibliothèque d'icônes SVG pour l'interface utilisateur |

---

## 📊 Données de la Plateforme

| Catégorie | Quantité | Détails |
|---|---|---|
| **Produits agricoles** | 38 | Céréales, tubercules, légumes, fruits, bétail, poissons, produits transformés |
| **Prix enregistrés** | 238+ | Prix mis à jour quotidiennement dans tous les marchés |
| **Marchés** | 21 | Répartis sur les 5 régions du Togo |
| **Régions couvertes** | 5 | Maritime, Plateaux, Centrale, Kara, Savanes |
| **Annonces marketplace** | 20 | Vente et achat de produits agricoles |
| **Posts forum** | 14 | Discussions et échanges communautaires |
| **Langues** | 3 | Français, Éwé, Kabyè |

---

## 🗂️ Structure du Projet

```
TogoAgric/
├── public/
│   ├── admin-photo.png          # Photo de l'administrateur (chatbot)
│   ├── togo-agric-logo.png       # Logo de la plateforme
│   └── robots.txt                # Instructions pour les robots d'indexation
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Layout racine (metadata, polices)
│   │   ├── page.tsx              # Page principale (Single Page Application)
│   │   ├── globals.css           # Styles globaux Tailwind CSS
│   │   └── api/
│   │       ├── products/route.ts       # API Produits
│   │       ├── prices/route.ts         # API Prix
│   │       ├── markets/route.ts         # API Marchés
│   │       ├── regions/route.ts         # API Régions
│   │       ├── listings/route.ts        # API Annonces
│   │       ├── weather/route.ts         # API Météo (Open-Meteo)
│   │       ├── forum-posts/route.ts     # API Forum
│   │       ├── chatbot/route.ts         # API Chatbot IA
│   │       ├── alerts/route.ts          # API Alertes
│   │       ├── notifications/route.ts   # API Notifications
│   │       ├── favorites/route.ts       # API Favoris
│   │       ├── users/route.ts           # API Utilisateurs
│   │       └── auth/
│   │           ├── login/route.ts              # API Connexion
│   │           ├── register/route.ts           # API Inscription
│   │           ├── profile/route.ts           # API Profil
│   │           ├── change-password/route.ts   # API Changement mot de passe
│   │           ├── google/route.ts            # API OAuth Google
│   │           └── microsoft/route.ts         # API OAuth Microsoft
│   │
│   ├── components/
│   │   └── togo-agric/
│   │       ├── header.tsx              # En-tête avec navigation et sélecteur de langue
│   │       ├── footer.tsx              # Pied de page avec informations
│   │       ├── home-section.tsx        # Section d'accueil avec statistiques
│   │       ├── prices-section.tsx      # Section prix avec filtres et recherche
│   │       ├── marketplace-section.tsx  # Section marketplace (vente/achat)
│   │       ├── weather-section.tsx     # Section météo en temps réel
│   │       ├── directory-section.tsx   # Répertoire des marchés par région
│   │       ├── forum-section.tsx       # Forum communautaire
│   │       ├── alerts-section.tsx      # Alertes et notifications
│   │       ├── dashboard-section.tsx   # Tableau de bord administrateur
│   │       ├── profile-section.tsx     # Gestion de profil utilisateur
│   │       ├── chatbot.tsx             # Chatbot IA flottant avec photo admin
│   │       ├── auth-dialog.tsx         # Modal de connexion/inscription
│   │       ├── create-listing-dialog.tsx # Modal de création d'annonce
│   │       └── notification-bell.tsx   # Cloche de notifications
│   │
│   ├── data/
│   │   └── db.json               # Base de données JSON intégrée (333 Ko)
│   │
│   ├── lib/
│   │   ├── db.ts                 # Utilitaire de lecture des données JSON
│   │   ├── i18n.ts               # Système d'internationalisation (FR/Éwé/Kabyè)
│   │   ├── data.ts               # Fonctions utilitaires pour les données
│   │   └── togo-data.ts          # Données spécifiques au Togo
│   │
│   └── hooks/
│       └── use-auth.ts           # Hook personnalisé d'authentification
│
├── package.json                   # Dépendances et scripts npm
├── tsconfig.json                  # Configuration TypeScript
├── next.config.ts                 # Configuration Next.js
├── postcss.config.mjs             # Configuration PostCSS
├── eslint.config.mjs              # Configuration ESLint
├── installer.bat                  # Script d'installation Windows
└── demarrer.bat                   # Script de démarrage Windows
```

---

## 🚀 Installation et Démarrage

### Prérequis

| Outil | Version minimum | Lien de téléchargement |
|---|---|---|
| **Node.js** | 18.x ou supérieur | https://nodejs.org/ |
| **npm** | 9.x ou supérieur | Inclus avec Node.js |
| **Git** (optionnel) | 2.x | https://git-scm.com/ |

### Installation

#### Étape 1 : Cloner le dépôt
```bash
git clone https://github.com/votre-compte/TogoAgric.git
cd TogoAgric
```

#### Étape 2 : Installer les dépendances
```bash
npm install
```

#### Étape 3 : Lancer le serveur de développement
```bash
npm run dev
```
Le site est accessible à l'adresse **http://localhost:3000**

### Démarrage rapide sur Windows

Double-cliquez sur le fichier `demarrer.bat` dans le dossier du projet. Ce script lance automatiquement le serveur de développement.

---

## 📱 Fonctionnalités Détaillées

### 1. Accueil
- Statistiques en temps réel (produits, marchés, prix, régions)
- Grille de produits avec emojis et catégories
- Filtrage par catégorie (céréales, tubercules, légumes, fruits, bétail, poissons, produits transformés)
- Navigation intuitive vers toutes les sections

### 2. Prix Agricoles
- Affichage des prix pour 238+ enregistrements
- Recherche par nom de produit
- Filtrage par marché et par catégorie
- Prix affichés en FCFA avec unité de mesure
- Dates de mise à jour des prix

### 3. Marketplace (Achats & Ventes)
- **Vente** : Les agriculteurs publient leurs produits avec prix et quantité
- **Achat** : Les acheteurs publient leurs besoins
- Contact direct par téléphone
- Annonces filtrables par type (vente/achat) et par recherche textuelle
- Informations détaillées : produit, quantité, prix, localisation

### 4. Météo Agricole en Temps Réel
- Prévisions pour les 5 régions du Togo
- Données provenant de l'API Open-Meteo (gratuite, sans clé API)
- Informations affichées : température, humidité, vent, précipitations
- Coordonnées GPS par région :
  - Maritime : 6.13°N, 1.22°E (Lomé)
  - Plateaux : 7.53°N, 1.13°E (Atakpamé)
  - Centrale : 9.20°N, 1.13°E (Sokodé)
  - Kara : 9.55°N, 1.17°E (Kara)
  - Savanes : 10.86°N, 0.23°E (Dapaong)

### 5. Répertoire des Marchés
- 21 marchés répertoriés dans les 5 régions
- Recherche par nom de marché
- Filtrage par région
- Informations : nom, région, préfecture, description, coordonnées GPS

### 6. Forum Communautaire
- Posts avec auteur, date, titre, contenu
- Compteurs de vues et de réponses
- Catégorisation par tags
- Espace d'échange entre agriculteurs et experts

### 7. Chatbot IA 🤖
- Bouton flottant vert en bas à droite de l'écran
- Photo de l'administrateur KOUMEKPO Ablam comme avatar
- Questions rapides pré-définies
- Réponses en 3 langues (FR/Éwé/Kabyè)
- Connaissances intégrées :
  - **Prix** : Prix moyen, min, max par produit et par marché
  - **Météo** : Informations sur les prévisions par région
  - **Marchés** : Liste complète des 21 marchés
  - **Conseils agricoles** : Saisons de plantation, irrigation, fertilisation
  - **Aide** : Guide d'utilisation du chatbot

### 8. Authentification
- Connexion par email et mot de passe
- Inscription avec nom, email, téléphone, mot de passe
- Boutons OAuth Google et Microsoft (préparés pour l'intégration)
- Changement de mot de passe dans le profil utilisateur
- Session persistante pendant la navigation

### 9. Internationalisation (i18n)
- **3 langues** supportées : Français, Éwé, Kabyè
- Sélecteur de langue dans l'en-tête
- Traduction de tous les éléments de l'interface
- Noms de produits traduits (ex : Maïs = Ebli = Kpila)
- Noms de régions traduits (ex : Centrale = Gota ƒe ƒome = Tîsânnin)

---

## 🗺️ Régions et Marchés du Togo

| Région | Capitale | Marchés |
|---|---|---|
| **Maritime** | Lomé | Adawlito, Tokoin, Kégué, Hedzranawoé, Agoè |
| **Plateaux** | Atakpamé | Atakpamé, Kpalimé, Notsé, Badou |
| **Centrale** | Sokodé | Sokodé, Tchamba, Sotouboua, Blitta |
| **Kara** | Kara | Kara, Bafilo, Bassar, Niamtougou |
| **Savanes** | Dapaong | Dapaong, Cinkassé, Mango, Sansanné-Mango |

---

## 🌾 Produits Agricoles

### Céréales (7)
| Produit | Français | Éwé | Kabyè |
|---|---|---|---|
| 🌾 Sorgho | Sorgho | Sɔglo | Yɔɔt |
| 🌽 Maïs | Maïs | Ebli | Kpila |
| 🌾 Fonio | Fonio | Fonio | Fonio |
| 🍚 Riz | Riz | Dzodzi | Pɛɛri |
| 🌾 Mil | Mil | Nukpa | Puh |
| 🌾 Sorgho | Sorgho | Sɔglo | Yɔɔt |

### Tubercules (5)
| Produit | Français | Éwé | Kabyè |
|---|---|---|---|
| 🥔 Manioc | Manioc | Agbeli | Bwan |
| 🥔 Igname | Igname | Kɔklo | Yum |
| 🥔 Taro | Taro | Amane | Amalɛ |
| 🥔 Macabo | Macabo | Makabo | Makabo |
| 🍠 Patate douce | Patate douce | Bɔkɔ | Bwakpɛl |

### Légumes (8)
| Produit | Français | Éwé | Kabyè |
|---|---|---|---|
| 🧅 Oignon | Oignon | Alɔshia | Yabal |
| 🍅 Tomate | Tomate | Gboma | Tomat |
| 🌶️ Piment | Piment | Ata | Kpɛk |
| 🫛 Gombo | Gombo | Fufu | Gɔmbɔ |
| 🥒 Concombre | Concombre | Anasi | Anasi |
| 🥬 Laitue | Laitue | Laitue | Laitus |
| 🥕 Carotte | Carotte | Kasabo | Kasabo |
| 🥬 Chou | Chou | Chou | Chou |

### Fruits (6)
| Produit | Français | Éwé | Kabyè |
|---|---|---|---|
| 🍌 Banane | Banane | Klaklo | Klaklo |
| 🍍 Ananas | Ananas | Ananas | Ananas |
| 🥭 Mangue | Mangue | Manga | Manga |
| 🍈 Papaye | Papaye | Kpɛtsi | Kpɛtsi |
| 🥑 Avocat | Avocat | Avoka | Avoka |
| 🍊 Agrume | Agrume | Anyanya | Anyanya |

### Bétail (5)
| Produit | Français | Éwé | Kabyè |
|---|---|---|---|
| 🐔 Volaille | Volaille | Klo | Klo |
| 🐐 Chèvre | Chèvre | Agbe | Agbe |
| 🐑 Mouton | Mouton | Aku | Aku |
| 🐄 Bœuf | Bœuf | Ave | Ave |
| 🐷 Porc | Porc | Eli | Eli |

### Poissons (3)
| Produit | Français | Éwé | Kabyè |
|---|---|---|---|
| 🐟 Poisson fumé | Poisson fumé | Efi kpui | Nzel kpay |
| 🐟 Tilapia | Tilapia | Tilapia | Tilapia |
| 🐟 Bar | Bar | Bar | Bar |

### Produits Transformés (4)
| Produit | Français | Éwé | Kabyè |
|---|---|---|---|
| 🫙 Huile de palme | Huile de palme | Ami | Ami |
| 🫘 Gari | Gari | Agbeli kɔklo | Bwan gari |
| ☕ Café | Café | Kafe | Kafe |
| 🫘 Cacao | Cacao | Kakao | Kakao |

---

## 🔌 API Endpoints

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Liste des 38 produits |
| `GET` | `/api/prices` | Liste des 238+ prix |
| `GET` | `/api/markets` | Liste des 21 marchés |
| `GET` | `/api/regions` | Liste des 5 régions |
| `GET` | `/api/listings` | Liste des annonces marketplace |
| `GET` | `/api/weather` | Météo en temps réel (Open-Meteo) |
| `GET` | `/api/forum-posts` | Liste des posts du forum |
| `POST` | `/api/chatbot` | Envoyer un message au chatbot |
| `POST` | `/api/auth/login` | Connexion utilisateur |
| `POST` | `/api/auth/register` | Inscription utilisateur |
| `GET` | `/api/auth/profile` | Profil utilisateur |
| `POST` | `/api/auth/change-password` | Changement de mot de passe |
| `GET` | `/api/auth/google` | OAuth Google |
| `GET` | `/api/auth/microsoft` | OAuth Microsoft |
| `GET` | `/api/alerts` | Liste des alertes |
| `GET` | `/api/notifications` | Liste des notifications |
| `GET` | `/api/favorites` | Liste des favoris |
| `GET` | `/api/users` | Liste des utilisateurs |

---

## 💳 Paiements Mobiles (Prochainement)

La plateforme prévoit l'intégration des solutions de paiement mobile les plus populaires au Togo :

- **T-Money** (Togocom)
- **Flooz** (Moov Africa)
- **Western Union**
- **Orange Money**

---

## 🔒 Sécurité

- Authentification par session côté serveur
- Mot de passe hashé (préparation bcryptjs)
- Protection CSRF
- Validation des entrées utilisateur
- Données sensibles uniquement côté serveur (variables d'environnement)

---

## 📄 Licence

Ce projet est la propriété de **KOUMEKPO Ablam**. Tous droits réservés © 2026.

---

## 🤝 Contribution

Pour contribuer au développement de TogoAgric :

1. Fork le dépôt
2. Créez une branche de fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commitez vos modifications (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créez une Pull Request

Contactez le fondateur **KOUMEKPO Ablam** (koumekpoablam3@gmail.com) pour toute collaboration.

---

<div align="center">

**TogoAgric** — *L'agriculture togolaise connectée au numérique*

Développé avec ❤️ par **KOUMEKPO Ablam**

📞 96327992 | ✉️ koumekpoablam3@gmail.com

© 2026 — Tous droits réservés

</div>
