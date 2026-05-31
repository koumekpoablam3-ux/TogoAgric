import { NextResponse } from 'next/server';

// ============================================
// AgriBot v7 — Chatbot intelligent TogoAgric
// Base de connaissances MASSIVE (sans dépendance externe)
// ============================================

interface KnowledgeEntry {
  keywords: string[];
  response: string;
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ===== PRODUITS AGRICOLES =====
  {
    keywords: ['prix', 'cout', 'tarif', 'valeur', 'cher', 'moins cher', 'moyen'],
    response: '💰 Voici les prix moyens au Togo :\n\n🌽 Maïs : 200-300 FCFA/kg\n🥔 Igname : 300-400 FCFA/kg\n🍅 Tomate : 350-500 FCFA/kg\n🥔 Manioc : 150-250 FCFA/kg\n🍚 Riz : 400-500 FCFA/kg\n🌶️ Piment : 400-600 FCFA/kg\n🫘 Gari : 300-400 FCFA/kg\n🍌 Banane plantain : 600-900 FCFA/botte\n🍍 Ananas : 300-500 FCFA/pièce\n🐔 Volaille : 3 000-4 000 FCFA/pièce\n🐟 Poisson fumé : 2 500-3 500 FCFA/kg\n🫙 Huile de palme : 700-900 FCFA/litre\n☕ Café : 1 500-2 000 FCFA/kg\n🐐 Chèvre : 20 000-30 000 FCFA/tête\n🐄 Bœuf : 250 000-400 000 FCFA/tête\n🧅 Oignon : 300-500 FCFA/kg\n🫛 Niébé : 400-600 FCFA/kg\n🥜 Arachide : 400-600 FCFA/kg\n🫘 Soja : 350-500 FCFA/kg\n🍯 Miel : 3 000-5 000 FCFA/kg\n\n💡 Consultez "Prix du Jour" pour les prix en temps réel !'
  },
  {
    keywords: ['mais', 'maïs'],
    response: '🌽 Le maïs est cultivé partout au Togo !\n\n📍 Centrale (Sokodé, Tchamba) — plus grande région productrice\n📍 Plateaux (Atakpamé, Kpalimé)\n📍 Kara (Bassar, Bafilo)\n\n💰 Prix : 200-300 FCFA/kg\n📅 Semis en mai-juin, récolte en septembre-octobre\n💡 Variétés : TZEE-W, DMR-ESR-W, Ikenne\n💡 Rendement : 1,5-2,5 tonnes/ha\n\nLe maïs se consomme en bouillie (aklui), en pâte (fufu), grilled et en pop-corn !'
  },
  {
    keywords: ['igname', 'ignames'],
    response: '🥔 L\'igname de Bassar est célèbre au Togo !\n\n💰 Prix : 300-400 FCFA/kg\n📅 Plantation : mars-avril, récolte : novembre-février\n💡 Variétés : Kponan, Floro, Krenglè\n💡 Rendement : 10-15 tonnes/ha\n\nL\'igname est le "roi des tubercules" au Togo !'
  },
  {
    keywords: ['tomate', 'tomates'],
    response: '🍅 La tomate est cultivée surtout dans les Plateaux et la région Maritime !\n\n💰 Prix : 350-500 FCFA/kg\n📍 Maritime (Lomé, Tsévié), Plateaux (Kpalimé)\n📅 Semis : septembre-octobre et mars-avril\n💡 Variétés : Roma VF, Tropimech, Rio Grande\n💡 Rendement : 15-25 tonnes/ha'
  },
  {
    keywords: ['manioc', 'cassave', 'gari'],
    response: '🥔 Le manioc est un aliment de base au Togo !\n\n💰 Prix : 150-250 FCFA/kg\n📅 Plantation : avril-mai, récolte : 12-18 mois après\n\nOn le transforme en gari, attiéké, foutou, fufu, amidoun.\nVariétés : TMS 30572, 4(2)1425\nRendement : 15-25 tonnes/ha\n\n⚠️ Le manioc cru contient du cyanure — toujours bien cuit !'
  },
  {
    keywords: ['riz'],
    response: '🍚 Le riz est cultivé au Togo, surtout dans les vallées inondables !\n\n💰 Prix : 400-500 FCFA/kg\n📍 Maritime (vallée du Mono), Savanes\n💡 Variétés NERICA recommandées\n💡 Rendement : 2-4 tonnes/ha'
  },
  {
    keywords: ['piment'],
    response: '🌶️ Le piment est très rentable au Togo !\n\n💰 Prix : 400-600 FCFA/kg\n📅 Semis : septembre-novembre, récolte : 3 mois\n💡 Rendement : 5-10 tonnes/ha\n\nLe piment togolais est exporté vers le Ghana, le Bénin et le Nigeria !'
  },
  {
    keywords: ['ananas'],
    response: '🍍 L\'ananas de Bafilo est le plus célèbre du Togo !\n\n💰 Prix : 300-500 FCFA/pièce\n📍 Région de Kara (Bafilo)\n📅 Récolte : avril à septembre\n💡 Variété : Cayenne Lisse\n💡 Rendement : 50 000-80 000 fruits/ha\n\nLe Togo exporte l\'ananas vers l\'Europe !'
  },
  {
    keywords: ['cafe', 'café'],
    response: '☕ Le café togolais est de qualité !\n\n💰 Prix : 1 500-2 000 FCFA/kg\n📍 Plateaux (Atakpamé, Kloto)\n📅 Récolte : octobre-janvier\n💡 Rendement : 800-1 200 kg/ha'
  },
  {
    keywords: ['cacao'],
    response: '🍫 Le cacao togolais est un produit de rente !\n\n💰 Prix : 800-1 200 FCFA/kg\n📍 Plateaux (Atakpamé, Kloto, Agou)\n📅 Récolte : octobre-janvier\n💡 Rendement : 400-800 kg/ha'
  },
  {
    keywords: ['volaille', 'poulet', 'poules', 'poussin'],
    response: '🐔 L\'élevage de volaille au Togo :\n\n💰 Prix : 3 000-4 000 FCFA/pièce\n💡 Poussins vaccinés : 500-700 FCFA/poussin\n💡 Cycle : 3 mois\n\nRentabilité : 50 poulets → ~95 000 FCFA de profit/3 mois !'
  },
  {
    keywords: ['poisson', 'tilapia', 'pêche', 'peche'],
    response: '🐟 Le poisson est très consommé au Togo !\n\n💰 Poisson fumé : 2 500-3 500 FCFA/kg\n📍 Lac Togo, fleuve Mono\n\nPisciculture : Tilapia, 6 mois de cycle\n1 étang de 100 m² → 200-300 kg de poisson'
  },
  {
    keywords: ['chevre', 'chèvre', 'elevage', 'élevage', 'betail', 'bétail', 'vache', 'boeuf', 'bœuf'],
    response: '🐐 L\'élevage au Nord du Togo :\n\n💰 Chèvre : 20 000-30 000 FCFA/tête\n💰 Mouton : 35 000-50 000 FCFA/tête\n💰 Bœuf : 250 000-400 000 FCFA/tête\n\n📍 Savanes (Dapaong), Kara\n50 chèvres → 600 000-800 000 FCFA/an'
  },
  {
    keywords: ['oignon'],
    response: '🧅 L\'oignon de Dapaong est célèbre !\n\n💰 Prix : 300-500 FCFA/kg\n📍 Savanes (Dapaong, Mango)\n📅 Semis : octobre-novembre, récolte : février-mars\n💡 Rendement : 15-25 tonnes/ha'
  },
  {
    keywords: ['arachide'],
    response: '🥜 L\'arachide est importante au Togo !\n\n💰 Prix : 400-600 FCFA/kg\n📅 Semis : juin-juillet, récolte : octobre-novembre\n💡 Rendement : 1-2 tonnes/ha\n\nUtilisée en sauce, beurre, huile et kuli-kuli !'
  },
  {
    keywords: ['niebe', 'haricot', 'feve', 'fève'],
    response: '🫛 Le niébé est riche en protéines (25%) !\n\n💰 Prix : 400-600 FCFA/kg\n📅 Semis : juillet-août, récolte : octobre-décembre\n💡 Rendement : 500-1 000 kg/ha'
  },
  {
    keywords: ['banane', 'plantain'],
    response: '🍌 La banane plantain au Togo :\n\n💰 Prix : 600-900 FCFA/botte\n📅 Plantation : début des pluies, récolte : 10-12 mois\n💡 Rendement : 10-20 tonnes/ha'
  },
  {
    keywords: ['soja'],
    response: '🫘 Le soja (40% protéines) au Togo :\n\n💰 Prix : 350-500 FCFA/kg\n📅 Semis : juin-juillet, récolte : novembre\n💡 Rendement : 1,5-2,5 tonnes/ha\n\nSe transforme en lait, tofu, sauce !'
  },
  {
    keywords: ['huile de palme', 'palmier', 'palme'],
    response: '🫙 L\'huile de palme est traditionnelle au Togo !\n\n💰 Prix : 700-900 FCFA/litre\n📍 Plateaux, Maritime, Centrale\n\n1 palmier produit 6-8 régimes/an = 1,5-3 litres d\'huile'
  },
  {
    keywords: ['mangue', 'mangues'],
    response: '🥭 La mangue togolaise :\n\n💰 Prix : 100-300 FCFA/pièce (saison)\n📅 Saison : mars-juillet\n\nVariétés : Kent, Amélie, Keitt\nExportée vers l\'Europe !'
  },
  {
    keywords: ['papaye'],
    response: '🍈 La papaye est cultivée partout au Togo !\n\n💰 Prix : 100-200 FCFA/pièce\n\nCulture facile (6-9 mois), riche en vitamines A et C'
  },
  // ===== MÉTÉO ET CLIMAT =====
  {
    keywords: ['meteo', 'météo', 'climat', 'plui', 'saison', 'temps', 'temperature', 'température', 'chaleur', 'froid', 'sec', 'humide'],
    response: '🌤️ Le Togo a un climat tropical :\n\n📅 Pluies : avril-octobre\n📅 Saison sèche : novembre-mars\n\n🌡️ Températures :\n• Lomé : 26-32°C\n• Plateaux : 20-28°C\n• Sokodé : 28-36°C\n• Kara : 30-38°C\n• Dapaong : 32-40°C'
  },
  // ===== CALENDRIER AGRICOLE =====
  {
    keywords: ['planter', 'plantation', 'semis', 'cultiver', 'recolte', 'récolte', 'moment', 'periode', 'période'],
    response: '🌱 Calendrier agricole du Togo :\n\n📅 Jan-Mars : Préparation sols, récolte igname/manioc\n📅 Avr-Juin : Semis maïs, arachide, niébé, soja\n📅 Juil-Août : Désherbage, traitements\n📅 Sep-Oct : Récolte maïs, riz, arachide\n📅 Nov-Déc : Récolte igname, manioc, stockage'
  },
  // ===== PAIEMENTS =====
  {
    keywords: ['t-money', 'tmoney', 'flooz', 'moov', 'paiement', 'payer', 'mobile money', 'transferer', 'envoi'],
    response: '📱 Moyens de paiement au Togo :\n\n💚 T-Money (Togocom) — *110#\n🟠 Flooz / Moov Money — *155#\n💵 Cash (FCFA)\n🏦 Ecobank, BIA Togo, Union Togo, Orabank\n🌍 Western Union, MoneyGram'
  },
  // ===== MARCHÉS =====
  {
    keywords: ['marche', 'marché', 'acheter', 'boutique', 'commer', 'commerce'],
    response: '🏪 Les 21 marchés du Togo :\n\n📍 Maritime : Lomé, Tokoin, Adawlito, Agoè, Kégué\n📍 Plateaux : Kpalimé, Atakpamé, Badou, Notsé\n📍 Centrale : Sokodé, Tchamba, Sotouboua, Blitta\n📍 Kara : Kara, Bassar, Bafilo, Niamtougou\n📍 Savanes : Dapaong, Mango, Cinkassé, Tone'
  },
  // ===== RÉGIONS =====
  {
    keywords: ['region', 'région', 'zone', 'terroir', 'carte'],
    response: '🗺️ Les 5 régions du Togo :\n\n1️⃣ Maritime — Lomé — 26-32°C\n2️⃣ Plateaux — Atakpamé — 20-28°C\n3️⃣ Centrale — Sokodé — 28-36°C\n4️⃣ Kara — Kara — 30-38°C\n5️⃣ Savanes — Dapaong — 32-40°C'
  },
  {
    keywords: ['lome', 'lomé'],
    response: '🏙️ Lomé, capitale du Togo :\n\n📍 Marchés : Lomé, Tokoin, Adawlito, Agoè, Kégué\n🌡️ 26-32°C\n🌾 Tomates, piments, maïs, poisson, volaille\n👥 3M+ habitants'
  },
  {
    keywords: ['sokode', 'sokodé'],
    response: '🏙️ Sokodé — Capitale du maïs !\n\n📍 Marchés : Sokodé, Tchamba, Sotouboua, Blitta\n🌾 Maïs, igname, manioc, gari, niébé\n👥 700 000+ habitants'
  },
  {
    keywords: ['kara', 'bassar', 'bafilo'],
    response: '🏙️ Région de la Kara :\n\n🌾 Igname de Bassar, ananas de Bafilo, maïs, bétail\n📍 Marchés : Kara, Bassar, Bafilo, Niamtougou\n👥 900 000+ habitants'
  },
  {
    keywords: ['dapaong', 'savanes'],
    response: '🏙️ Savanes — Dapaong :\n\n🌾 Bétail, oignon de Dapaong, coton, mil, sorgho\n📍 Marchés : Dapaong, Mango, Cinkassé, Tone\n🌡️ 32-40°C — la région la plus chaude !'
  },
  {
    keywords: ['kpalime', 'atakpame', 'plateaux'],
    response: '🏙️ Région des Plateaux :\n\n🌾 Café, cacao, huile de palme, banane plantain, tomate\n📍 Marchés : Kpalimé, Atakpamé, Badou, Notsé\n🌡️ 20-28°C — la région la plus fraîche !'
  },
  // ===== CONNEXION =====
  {
    keywords: ['connexion', 'connecter', 'inscrire', 'compte', 'login', 'inscription', 'mdp', 'mot de passe'],
    response: '🔑 Pour vous connecter, utilisez le bouton « Se connecter » en haut de la page. Les comptes de démonstration sont disponibles dans le formulaire de connexion.'
  },
  // ===== FINANCEMENT =====
  {
    keywords: ['credit', 'prêt', 'microfinance', 'banque', 'financement', 'subvention', 'investissement'],
    response: '🏦 Financement agricole au Togo :\n\n🏦 Ecobank, BIA Togo, Union Togo, Orabank\n📱 FUCEC, WAPS, ASA, CAC\n🏛️ PNIA, PADR, PPAAO\n🌍 FAO, FIDA, USAID, GIZ, BAD'
  },
  // ===== SANTÉ DES PLANTES =====
  {
    keywords: ['maladie', 'traitement', 'insecte', 'ravageur', 'pest', 'phytosanitaire', 'engrais', 'fertilisant', 'compost'],
    response: '🌿 Santé des cultures :\n\n🐛 Pucerons → Savon noir + neem\n🐛 Chenilles → Bacillus thuringiensis\n🦠 Mildiou → Bouillie bordelaise\n🌱 Compost : déchets végétaux + fumier\n💡 Contactez l\'ICAT dans votre préfecture !'
  },
  // ===== STOCKAGE =====
  {
    keywords: ['stock', 'stockage', 'conserver', 'conservation', 'sech', 'séchage'],
    response: '📦 Conservation :\n\n🌽 Maïs : 6-12 mois (sac de jute, sec)\n🥔 Igname : 3-5 mois (frais, sombre)\n🫘 Gari : 6-12 mois (sac fermé)\n🍅 Tomate : 5-7 jours (ou sauce/séché)'
  },
  // ===== FORUM =====
  {
    keywords: ['forum', 'communaute', 'communauté', 'discussion', 'entraide', 'partager'],
    response: '💬 Le forum TogoAgric est l\'espace de discussion de la communauté agricole ! Posez vos questions et partagez vos expériences.'
  },
  // ===== CONTACT =====
  {
    keywords: ['contact', 'telephone', 'numéro', 'appeler', 'aide', 'support', 'email'],
    response: '📞 Contacts TogoAgric :\n\n📱 +228 96 32 79 92\n📧 koumekpoablam3@gmail.com\n📍 Lomé, Togo'
  },
  // ===== TRANSFORMATION =====
  {
    keywords: ['transformer', 'transformation', 'industrie', 'conserve', 'jus', 'confiture'],
    response: '🏭 Transformation agricole :\n\nManioc → Gari, attiéké, foutou\nMaïs → Farine, pop-corn\nAnanas → Jus, confiture\nSoja → Lait, tofu\nLa transformation augmente la valeur de 2 à 5 fois !'
  },
  // ===== EXPORT =====
  {
    keywords: ['export', 'exporter', 'international', 'etranger', 'étranger', 'ghana', 'benin', 'bénin', 'nigeria', 'europe'],
    response: '🌍 Export depuis le Togo :\n\nAnanas, cacao, café, coton, poisson fumé, oignon, huile de palme, mangue, sésame\n💡 Port autonome de Lomé → Europe en 10-15 jours'
  },
  // ===== IRRIGATION =====
  {
    keywords: ['irrigation', 'arroser', 'forage', 'pompage', 'motopompe'],
    response: '💧 Irrigation au Togo :\n\n🔧 Goutte-à-goutte : 150 000-250 000 FCFA/500m²\n🔧 Motopompe : 200 000-400 000 FCFA\n🔧 Forage : 500 000-1 500 000 FCFA\n💡 Subventions disponibles à la Direction de l\'Agriculture !'
  },
  // ===== MARKETING =====
  {
    keywords: ['vendre mieux', 'marketing', 'client', 'profit', 'gagner argent'],
    response: '💼 Vendre mieux :\n\n1. Allez tôt au marché (5h-7h)\n2. Contactez restaurants/hôtels\n3. Utilisez TogoAgric Marketplace\n4. Transformez les produits (+200 à +500%)\n5. Livrez à domicile via WhatsApp'
  },
  // ===== COOPÉRATIVE =====
  {
    keywords: ['cooperative', 'coopérative', 'groupement', 'association'],
    response: '🤝 Coopératives au Togo :\n\n💡 Avantages : prix réduit, crédit, partage matériel, formation\n📋 Minimum 15 membres + statuts + enregistrement\n📞 FUPROCOM (Fédération des Unions de Coopératives)'
  },
  // ===== COTON =====
  {
    keywords: ['coton', 'textile'],
    response: '🧵 Le coton au Togo (Kara, Savanes) :\n\n📅 Semis : juin, récolte : novembre-décembre\n🏢 Géré par la SOTOCO\n💡 Rendement : 800-1 200 kg/ha'
  },
  // ===== SORGHO / MIL =====
  {
    keywords: ['sorgho', 'sorghum', 'mil', 'millet'],
    response: '🌾 Sorgho et mil dans le Nord :\n\n💰 Prix : 200-300 FCFA/kg\n💡 Résistants à la sécheresse\n💡 Rendement : 1-1,5 tonnes/ha\n\nUtilisés pour tchouk, fura, koko, dolo'
  },
  // ===== TRANSPORT =====
  {
    keywords: ['transport', 'camion', 'vehicule', 'livrer', 'livraison'],
    response: '🚚 Transport au Togo :\n\n🛣️ Lomé → Sokodé → Kara → Dapaong (N1)\n🚛 Camion 10T : 50 000-100 000 FCFA/charge\n🏍️ Zemidjan : 200-500 FCFA\n🛺 Keke (tricycle) pour livraison urbaine'
  },
  // ===== SOL =====
  {
    keywords: ['sol', 'terre', 'ph', 'fertilite', 'fertilité'],
    response: '🟫 Sols du Togo :\n\n• Maritime : sableux\n• Plateaux : ferrallitiques (café/cacao)\n• Centrale : argilo-sableux (céréales)\n• Kara : ferrugineux\n• Savanes : sablonneux\n\n💡 Compost = +50% rendement en 2 ans !'
  },
  // ===== SALUTATIONS =====
  {
    keywords: ['bonjour', 'salut', 'hello', 'hi', 'hey', 'merci', 'remercie', 'bien', 'good morning', 'good afternoon', 'good evening'],
    response: '🌿 Bonjour et bienvenue sur TogoAgric ! 🇹🇬\n\nJe suis AgriBot, votre assistant agricole virtuel. Je peux vous aider avec :\n\n💰 Prix des produits\n🌿 Conseils de culture\n🏪 Marchés et régions\n🌤️ Météo et calendrier\n📱 Paiement mobile\n📦 Stockage\n🏦 Financement\n\nPosez-moi n\'importe quelle question ! 🌱'
  },
  // ===== QUI ES-TU =====
  {
    keywords: ['qui es-tu', 'qui es tu', 'tu es qui', 'ton nom', 'comment tu t\'appelle', 'what are you', 'who are you', 'your name'],
    response: '🤖 Je suis AgriBot, l\'assistant de TogoAgric 🌾🇹🇬\n\n📊 38 produits, 21 marchés, 5 régions\n👨‍💻 Créé par Abalam KOUMEKPO\n📱 +228 96 32 79 92\n📧 koumekpoablam3@gmail.com'
  },
  // ===== SANTÉ HUMAINE =====
  {
    keywords: ['santé', 'nutrition', 'manger', 'alimentation', 'vitamine', 'protéine'],
    response: '🥗 Nutrition au Togo :\n\n💪 Protéines : niébé (25%), soja (40%), poisson\n🍊 Vitamines : mangue, papaye (C), patate douce (A)\n⚡ Énergie : maïs, riz, manioc, igname\n\n⚠️ L\'anémie est un problème — mangez des épinards et du niébé !'
  },
  // ===== ANNONCE =====
  {
    keywords: ['annonce', 'listing', 'publier', 'marketplace', 'creer annonce'],
    response: '📋 Créer une annonce :\n\n1. Allez dans "Marketplace"\n2. Cliquez "Créer une annonce"\n3. Remplissez : titre, description, type, prix, quantité, contact\n4. Publiez !'
  },
  // ===== EMPRUNT =====
  {
    keywords: ['emprunt', 'dette', 'remboursement', 'rembourser', 'prêter'],
    response: '💰 Emprunts agricoles au Togo :\n\n📍 FUCEC, WAPS, ASA Togo, Ecobank, BIA\n💰 Montant : 100 000 - 2 000 000 FCFA\n📊 Taux : 8-15% par an\n⏱️ Durée : 6-24 mois'
  },
  // ===== PROBLÈME TECHNIQUE =====
  {
    keywords: ['erreur', 'error', 'bug', 'marche pas', 'fonctionne pas', 'problème', 'page blanche', 'vide'],
    response: '🔧 En cas de problème :\n\n1. Actualisez (F5)\n2. Vérifiez internet\n3. Effacez le cache\n4. Redémarrez le serveur\n\n📱 +228 96 32 79 92 | 📧 koumekpoablam3@gmail.com'
  },
  // ===== LANGUES =====
  {
    keywords: ['ewé', 'ewe', 'kabiyè', 'kabyè', 'kab', 'langue', 'traduction', 'français'],
    response: '🌍 TogoAgric en 3 langues :\n\n🇫🇷 Français (officiel)\n🗣️ Éwé (Sud — 2,5M+ locuteurs)\n🗣️ Kabyè (Centre — 1M+ locuteurs)\n\nChangez avec FR | EWE | KAB en haut à droite !'
  },
  // ===== ALERTE =====
  {
    keywords: ['alerte', 'notification', 'rappel'],
    response: '🔔 Alertes TogoAgric :\n\n• Alertes de prix\n• Notifications de réponses au forum\n• Nouvelles annonces\n• Tendances des prix\n\nAllez dans "Alertes" pour créer les vôtres !'
  },
  // ===== ENGRAIS =====
  {
    keywords: ['engrai', 'npk', 'uree', 'urée', 'dose'],
    response: '🌿 Engrais au Togo :\n\n🌽 Maïs : NPK 200 kg/ha + Urée 100 kg/ha\n🍅 Tomate : Compost 20t/ha + NPK 150 kg/ha\n💰 NPK 50kg : 8 000-12 000 FCFA\n💡 Le compost coûte moins cher et améliore le sol !'
  },
  // ===== HORTICULTURE =====
  {
    keywords: ['legume', 'légume', 'maraîcher', 'maraichage', 'jardin', 'potager', 'laitue', 'carotte', 'concombre', 'aubergine', 'chou'],
    response: '🥬 Maraîchage au Togo :\n\n💰 Laitue : 150-300 FCFA, Carotte : 300-400 FCFA/kg\n📍 Maritime (Lomé, Tsévié), Plateaux (Kpalimé)\n💡 Jardin de 500 m² → 100 000-200 000 FCFA/mois !\n\nLe maraîchage est l\'activité la plus rentable par m² !'
  },
  // ===== ABEILLES =====
  {
    keywords: ['abeille', 'miel', 'apiculture', 'ruche'],
    response: '🐝 Apiculture au Togo :\n\n💰 Miel : 3 000-5 000 FCFA/kg\n💰 Investissement : 50 000-100 000 FCFA\n💰 Revenu/ruche/an : 30 000-75 000 FCFA\n\nTypes : Ruche Kenyane ou Langstroth\nLa pollinisation augmente vos rendements de 20-30% !'
  },
  // ===== PATATE DOUCE =====
  {
    keywords: ['patate', 'patate douce'],
    response: '🍠 Patate douce au Togo :\n\n💰 Prix : 150-250 FCFA/kg\n📅 Plantation : mai-juin, récolte : 4-5 mois\n💡 Variétés : Botobo (orange), Tamba, Krenglè\n💡 Rendement : 10-20 tonnes/ha'
  },
  // ===== ÉVÉNEMENTS =====
  {
    keywords: ['fete', 'fête', 'festival', 'evenement', 'événement'],
    response: '🎉 Événements agricoles :\n\n🌾 Fête du Maïs — sept/oct (Sokodé)\n🍍 Fête de l\'Ananas — avr/juin (Bafilo)\n🥔 Fête de l\'Igname — nov/déc (Bassar)\n☕ Salon du Café — jan (Atakpamé)'
  },
  // ===== SEMENCES =====
  {
    keywords: ['semence', 'graine', 'variété', 'amélioré'],
    response: '🌱 Semences au Togo :\n\n📍 ITRA, Projet National de Semences\n📍 Direction Régionale de l\'Agriculture\n\n💡 Les semences certifiées donnent 20-30% de rendement en plus !'
  },
  // ===== AU REVOIR =====
  {
    keywords: ['au revoir', 'à bientôt', 'bye', 'goodbye', 'ciao', 'adieu', 'bonne nuit', 'bonne soirée'],
    response: '👋 Au revoir et à bientôt ! 🇹🇬\n\nMerci d\'utiliser TogoAgric. N\'hésitez pas à revenir poser vos questions agricoles !\n\n📱 Contact : +228 96 32 79 92\n🌿 AgriBot — Toujours là pour vous aider !'
  },
  // ===== COMPLIMENTS =====
  {
    keywords: ['bravo', 'excellent', 'bien joué', 'super', 'génial', 'parfait', 'tu es fort', 'intelligent', 'awesome', 'great'],
    response: '😊 Merci beaucoup ! Je fais de mon mieux pour vous aider.\n\nSi vous avez d\'autres questions sur l\'agriculture au Togo, n\'hésitez pas ! Je suis là 24h/24. 🌱'
  },
  // ===== APOLOGIES =====
  {
    keywords: ['désolé', 'desole', 'pardon', 'excuse', 'sorry'],
    response: '🤝 Ce n\'est rien ! Pas besoin de s\'excuser.\n\nComment puis-je vous aider aujourd\'hui ? Posez-moi n\'importe quelle question sur l\'agriculture au Togo ! 🌱'
  },
  // ===== TOGO PAYS =====
  {
    keywords: ['capitale', 'superficie', 'independance', 'indépendance', 'drapeau', 'frontière', 'pays', 'togolais'],
    response: '🇹🇬 Le Togo :\n\n🏙️ Capitale : Lomé\n👥 Population : ~9 millions\n📏 Superficie : 56 785 km²\n📅 Indépendance : 27 avril 1960\n🇫🇷 Ancienne colonie française\n💵 Monnaie : FCFA (Franc CFA)\n\nFrontières : Ghana, Bénin, Burkina Faso, Guinée\nDrapeau : 5 bandes (vert, jaune, vert) + carré rouge/blanc'
  },
  // ===== CRÉATEUR =====
  {
    keywords: ['créateur', 'createur', 'fondateur', 'developpeur', 'développeur', 'abalam', 'koumekpo', 'proprietaire', 'propriétaire'],
    response: '👨‍💻 Créateur de TogoAgric :\n\n👤 Abalam KOUMEKPO\n📱 +228 96 32 79 92\n📧 koumekpoablam3@gmail.com\n📍 Lomé, Togo\n\nIl a créé TogoAgric pour aider les agriculteurs togolais !'
  },
  // ===== CUISINE =====
  {
    keywords: ['recette', 'cuisine', 'cuisiner', 'plat', 'fufu', 'sauce', 'kou', 'pate', 'pâte', 'ragout', 'diri'],
    response: '🍽️ Plats togolais :\n\n🥘 Fufu — pâte de igname/manioc avec sauce\n🥘 Akplè — pâte de maïs\n🍲 Sauce feuille — légumes feuilles\n🍲 Koklo — brochettes d\'igname\n🥘 Djollof rice — riz à l\'ouest-africaine\n🥘 Ablo — pain de maïs\n🍢 Koklo mèn — viande grillée\n🥘 Tchapalo — sauce à base de néré\n\nMangez local, mangez sain ! 🇹🇬'
  },
  // ===== FOOT / SPORT =====
  {
    keywords: ['foot', 'football', 'sport', 'equipe', 'équipe', 'adebayor', 'match', 'but'],
    response: '⚽ Football et Togo :\n\n🏟️ Équipe nationale : Les Éperviers du Togo\n⭐ Joueur célèbre : Emmanuel Adebayor\n🏆 Participation Coupe du Monde 2006\n🏟️ Stades : Stade de Kégué (Lomé)\n\nLe football est le sport national !'
  },
  // ===== MUSIQUE / CULTURE =====
  {
    keywords: ['musique', 'chanson', 'artiste', 'danse', 'culture', 'tradition'],
    response: '🎵 Culture togolaise :\n\n🎶 Artistes célèbres : King Mensah, ElavAnyo, Fofo\n💃 Danses : Agbadza, Kpéssé, Kamou\n🎭 Vaudou : religion traditionnelle pratiquée\n🎨 Artisanat : batik, sculpture, poterie\n\nLe Togo est riche en culture !'
  },
  // ===== TOURISME =====
  {
    keywords: ['tourisme', 'visite', 'vacance', 'plage', 'hotel', 'monument', 'site'],
    response: '🏖️ Tourisme au Togo :\n\n🏖️ Plages de Lomé et Aneho\n🏞️ Parc national de Fazao-Malfakassa\n🏔️ Mont Agou (986m — plus haut sommet)\n🏛️ Palais des Congrès (Lomé)\n🏛️ Marché central de Lomé\n🌊 Lac Togo\n🐍 Village de serpents de Kloto\n\nLe Togo a beaucoup à offrir !'
  },
  // ===== HISTOIRE =====
  {
    keywords: ['histoire', 'colonie', 'colonial', 'eyadema', 'gnassingbe', 'olympio', 'passé'],
    response: '📜 Histoire du Togo :\n\n🇩🇪 Protectorat allemand (1884-1914)\n🇫🇷 Mandat français (1914-1960)\n📅 Indépendance : 27 avril 1960\n👤 Sylvanus Olympio (1er président, assassiné 1963)\n👤 Gnassingbé Eyadéma (1967-2005)\n👤 Faure Gnassingbé (depuis 2005)\n\nLe Togo a une histoire riche !'
  },
  // ===== BLAGUES =====
  {
    keywords: ['blague', 'raconte', 'drôle', 'amusant', 'rire', 'humour', 'joke', 'funny'],
    response: '😄 Voici une blague togolaise :\n\n"Pourquoi l\'igname ne va jamais à l\'école ?"\n"Parce qu\'elle a toujours la tête dans la terre !"\n\n😄 Et une autre :\n\n"Un agriculteur dit à son fils : Si tu travailles dur dans le champ, tu pourras acheter un tracteur."\n"Le fils répond : C\'est bon Papa, je vais plutôt apprendre à conduire le tracteur !"\n\nDes blagues d\'agriculteurs, pour des agriculteurs ! 🌾'
  },
  // ===== MOTIVATION =====
  {
    keywords: ['motivation', 'courage', 'encouragement', 'moral', 'abandon', 'triste', 'fatigué', 'espoir', 'déprimé'],
    response: '💪 Courage ! L\'agriculture est noble !\n\n🌈 "L\'agriculteur est le premier médecin, le premier nutritionniste et le premier économiste."\n\n💡 Chaque grain que vous semez est un acte d\'espoir. Le Togo a besoin de ses agriculteurs ! Continuez votre beau travail.\n\n"Qui sème récolte" — Un proverbe qui n\'a jamais menti. 🌱\n\nVous n\'êtes pas seul(e) ! La communauté TogoAgric est là pour vous. 🤝'
  },
  // ===== MÉCANISATION =====
  {
    keywords: ['tracteur', 'outil', 'machine', 'equipement', 'équipement', 'mechanisation', 'mécanisation', 'labour'],
    response: '🚜 Mécanisation agricole au Togo :\n\n💪 Outils manuels : daba, houe, machette (5 000-15 000 FCFA)\n🚜 Motoculteur : 500 000-1 500 000 FCFA\n🚜 Tracteur : 5 000 000-15 000 000 FCFA\n💧 Motopompe : 200 000-400 000 FCFA\n\n💡 Groupements peuvent partager un tracteur ! Le PNIA offre des subventions.'
  },
  // ===== AGRICULTURE BIO =====
  {
    keywords: ['biologique', 'bio', 'organique', 'naturel', 'sans produit chimique', 'pesticide'],
    response: '🌿 Agriculture biologique au Togo :\n\n✅ Compost au lieu d\'engrais chimique\n✅ Neem au lieu de pesticides\n✅ Rotation des cultures\n✅ Paillage\n✅ Association de cultures\n\n💰 Les produits bio se vendent 30-50% plus cher !\nLe marché international demande de plus en plus de bio.'
  },
  // ===== FEMMES =====
  {
    keywords: ['femme', 'femmes', 'genre', 'egalite', 'égalité'],
    response: '👩‍🌾 Femmes dans l\'agriculture togolaise :\n\n📊 Les femmes produisent 60-70% de la nourriture du Togo !\n🌱 Elles cultivent le manioc, le gari, les légumes\n🫙 Elles transforment l\'huile de palme\n\n💡 Programmes d\'appui :\n• FUCEC (microfinance pour femmes)\n• FAO - Programme Genre\n• WAPS (Women Asset Building)\n\nLes femmes sont le pilier de l\'agriculture togolaise ! 👏'
  },
  // ===== JEUNESSE =====
  {
    keywords: ['jeune', 'jeunesse', 'emploi', 'chomage', 'étudiant', 'universitaire'],
    response: '👩‍🎓 Jeunesse et agriculture au Togo :\n\n📊 60% de la population a moins de 25 ans\n🌾 L\'agriculture offre de nombreuses opportunités :\n\n💰 Maraîchage : 100 000-200 000 FCFA/mois\n🐔 Élevage de volaille : 95 000 FCFA profit/cycle\n🐝 Apiculture : 30 000-75 000 FCFA/ruche/an\n📦 Transformation : +200 à +500% de valeur\n\n💡 Le gouvernement et les ONG offrent des formations gratuites ! Contactez l\'ICAT ou la DRA de votre région.'
  },
  // ===== CHANGEMENT CLIMATIQUE =====
  {
    keywords: ['climatique', 'changement climatique', 'rechauffement', 'sécheresse', 'inondation'],
    response: '🌡️ Changement climatique au Togo :\n\n⚠️ Dégradation des sols\n⚠️ Saisons irrégulières\n⚠️ Inondations et sécheresses\n\n💡 Solutions :\n• Variétés résistantes à la sécheresse\n• Irrigation (goutte-à-goutte)\n• Agroforesterie (arbres + cultures)\n• Conservation des eaux\n• Mulching/paillage\n\nLe gouvernement a un Plan National d\'Adaptation !'
  },
  // ===== PERTES POST-RÉCOLTE =====
  {
    keywords: ['perte', 'gaspillage', 'post-récolte'],
    response: '📉 Pertes post-récolte au Togo :\n\n📊 30-40% des fruits et légumes sont perdus !\n\n💡 Solutions :\n• Séchage (tomates, mangues)\n• Transformation (jus, confiture)\n• Stockage amélioré (fûts hermétiques)\n• Chaîne du froid\n• Vente rapide au marché\n\nLa réduction des pertes = plus de revenus !'
  },
  // ===== CALCUL =====
  {
    keywords: ['calcule', 'calcul', 'combien font', 'multipli', 'addition', 'resultat', 'somme'],
    response: '🧮 Pour les calculs, utilisez la calculatrice de votre téléphone !\n\nMais quelques repères utiles :\n📊 1 hectare = 10 000 m²\n📊 15% de 50 000 FCFA = 7 500 FCFA\n📊 1 tonne = 1 000 kg\n\n💡 Consultez "Prix du Jour" pour les prix actualisés !'
  },
  // ===== HEURE / DATE =====
  {
    keywords: ['heure', 'aujourd\'hui', 'quel jour'],
    response: '🕐 Je ne donne pas l\'heure en temps réel.\n\n📍 Lomé, Togo — fuseau GMT (UTC+0)\n📅 Regardez l\'heure sur votre téléphone !'
  },
  // ===== MONNAIE =====
  {
    keywords: ['monnaie', 'devise', 'fcfa', 'franc cfa', 'billet', 'argent'],
    response: '💵 Monnaie du Togo :\n\n💶 FCFA — Franc CFA\n💵 Billets : 500, 1000, 2000, 5000, 10000 FCFA\n🪙 Pièces : 50, 100, 200, 250, 500 FCFA\n\n💡 1 EUR ≈ 656 FCFA'
  },
  // ===== RELIGION =====
  {
    keywords: ['religion', 'vaudou', 'musulman', 'chrétien', 'eglise', 'église', 'mosquee'],
    response: '🕌 Religions au Togo :\n\n✝️ Christianisme (43%)\n☪️ Islam (36%)\n🪄 Vaudou et traditions (14%)\n🖤 Autres (7%)\n\nLe Togo est laïc. Toutes les religions coexistent pacifiquement.'
  },
  // ===== DÉMOGRAPHIE / POPULATION =====
  {
    keywords: ['population', 'habitants', 'demographie'],
    response: '👥 Démographie du Togo :\n\n📊 Population : ~9 millions (2024)\n📈 Croissance : ~2,5% par an\n👥 60% ont moins de 25 ans\n\n📍 Lomé : 3M+ habitants\n📊 Densité : ~159 hab/km²'
  },
  // ===== ÉCONOMIE =====
  {
    keywords: ['economie', 'économie', 'pib', 'riche', 'pauvre', 'gdp', 'croissance'],
    response: '📊 Économie du Togo :\n\n💰 PIB : ~7,5 milliards USD (2024)\n📈 Croissance : ~5% par an\n💼 Principaux secteurs :\n  • Agriculture (40% du PIB)\n  • Services (35%)\n  • Industrie (15%)\n\n💰 PIB/habitant : ~850 USD'
  },
  // ===== ÉDUCATION =====
  {
    keywords: ['education', 'école', 'universite', 'lycee', 'lycée', 'etude', 'etudier'],
    response: '🎓 Éducation au Togo :\n\n📊 Taux d\'alphabétisation : ~75%\n🏫 Université de Lomé, Université de Kara\n\n💡 Formations agricoles : CFA/ICAT dans chaque région\n📚 L\'université de Lomé propose des formations en agronomie !'
  },
  // ===== ACCUEIL =====
  {
    keywords: ['bienvenue', 'accueil', 'premiere fois', 'comment utiliser', 'aide moi'],
    response: '🌿 Bienvenue sur TogoAgric ! 🇹🇬\n\n1️⃣ Accueil — Prix, produits, météo\n2️⃣ Prix du Jour — Prix en temps réel\n3️⃣ Marketplace — Acheter/vendre\n4️⃣ Météo — Prévisions\n5️⃣ Forum — Discussions\n6️⃣ 💡 — Connexion/Inscription\n7️⃣ 💬 — Posez-moi des questions !'
  },
  // ===== ENGLISH QUESTIONS =====
  {
    keywords: ['what is', 'how to', 'tell me', 'can you', 'do you know', 'help me', 'explain', 'describe'],
    response: '🌍 Welcome to TogoAgric ! 🇹🇬\n\nI\'m AgriBot. I can help with:\n\n💰 Product prices\n🌿 Farming tips\n🏪 Markets & regions\n🌤️ Weather\n📱 Mobile payment\n\nPosez votre question en français ou en anglais !'
  },
  // ===== C'EST QUOI TOGOAGRIC =====
  {
    keywords: ['qu\'est-ce que', 'c\'est quoi', 'comment fonctionne', 'comment marche'],
    response: '🌿 TogoAgric est la plateforme agricole n°1 du Togo ! 🇹🇬\n\n📊 38+ produits avec prix en temps réel\n📊 21 marchés dans 5 régions\n💬 Forum communautaire\n🏪 Marketplace (vente/achat)\n🔔 Alertes de prix\n🌤️ Prévisions météo\n🌍 3 langues (FR, Éwé, Kabyè)\n📱 Paiement mobile (T-Money, Flooz)\n\n👨‍💻 Créé par Abalam KOUMEKPO\n📱 +228 96 32 79 92\n📧 koumekpoablam3@gmail.com'
  },
  // ===== POLITIQUE =====
  {
    keywords: ['president', 'gouvernement', 'politique', 'ministre', 'loi', 'election'],
    response: '🏛️ Institutions du Togo :\n\n👤 Président : Faure Gnassingbé (depuis 2005)\n🏛️ Assemblée nationale\n⚖️ Cour Suprême\n📍 Capitale : Lomé\n\nLe Togo est une République présidentielle multipartite.'
  },
  // ===== ÇA VA =====
  {
    keywords: ['ça va', 'ca va', 'comment vas', 'tu vas bien', 'comment allez'],
    response: '😊 Tout va très bien ! Merci de demander !\n\nJe suis AgriBot, toujours prêt à vous aider.\nQue souhaitez-vous savoir aujourd\'hui ? 🌱'
  },
  // ===== COMMENT/POURQUOI =====
  {
    keywords: ['pourquoi', 'tu as fait', 'tu as cree', 'tu as créé'],
    response: '💡 TogoAgric a été créé pour :\n\n1. Aider les agriculteurs togolais à trouver les meilleurs prix\n2. Faciliter l\'achat et la vente de produits\n3. Centraliser les informations agricoles\n4. Créer une communauté agricole forte\n5. Moderniser l\'agriculture togolaise\n\n👨‍💻 Créateur : Abalam KOUMEKPO\n📱 +228 96 32 79 92'
  },
  // ===== NE FONCTIONNE PAS =====
  {
    keywords: ['ca marche pas', 'ne fonctionne pas', 'je ne comprends pas', 'pas de reponse'],
    response: '🔧 Si j\'ai mal répondu :\n\n1. Reformulez plus simplement\n2. Essayez : "prix maïs", "marché Lomé", "cultiver tomate"\n3. Consultez la section correspondante du menu\n4. Contactez : 📱 +228 96 32 79 92\n\n💡 Je m\'améliore constamment ! 🌱'
  },
  // ===== TU ES INTELLIGENT =====
  {
    keywords: ['tu es intelligent', 'tu es fort', 'tu es bon', 'tu es humain', 'tu es un robot'],
    response: '🤖 Je suis AgriBot, un assistant IA spécialisé dans l\'agriculture togolaise !\n\n✅ 38+ produits et leurs prix\n✅ 21 marchés dans 5 régions\n✅ Conseils de culture et d\'élevage\n✅ 3 langues (FR, Éwé, Kabyè)\n\nJe fais de mon mieux pour vous aider ! 💪'
  },
  // ===== PROVERBES =====
  {
    keywords: ['proverbe', 'sagesse', 'dicton', 'citation', 'devise'],
    response: '🧓 Proverbes togolais :\n\n🌿 "L\'eau ne mouille pas la pierre." — La persévérance est clé.\n🌱 "Qui sème récolte."\n☀️ "Un seul arbre ne fait pas la forêt." — L\'union fait la force.\n🧓 "L\'igname de Bassar n\'est pas celle de Sokodé." — Chaque région a ses spécialités.'
  },
  // ===== TECHNOLOGIE =====
  {
    keywords: ['telephone', 'téléphone', 'portable', 'smartphone', 'android', 'iphone', 'app'],
    response: '📱 TogoAgric est accessible depuis votre téléphone !\n\n💡 Tapez l\'adresse dans le navigateur mobile.\n📱 Contact : +228 96 32 79 92\n\n💡 Avec un smartphone :\n• Consulter les prix en temps réel\n• Publier des annonces\n• Communiquer sur le forum'
  },
  // ===== BIODIVERSITÉ =====
  {
    keywords: ['biodiversite', 'animaux', 'oiseaux', 'foret', 'environnement', 'nature', 'parc national'],
    response: '🦁 Biodiversité du Togo :\n\n🌳 Forêts : 32% du territoire\n🦁 Parc national de Fazao-Malfakassa\n🦁 Réserve de Togodo\n\n🦅 600+ espèces d\'oiseaux\n🦎 Singes roux (endémiques)\n\n⚠️ La déforestation est un problème majeur.'
  },
  // ===== RIVIÈRES & LACS =====
  {
    keywords: ['riviere', 'fleuve', 'lac', 'mer', 'ocean', 'atlantique', 'eau douce'],
    response: '🌊 Hydrographie du Togo :\n\n🌊 Océan Atlantique (sud, 56 km de côte)\n🏙️ Lac Togo\n🏞️ Fleuve Mono, Fleuve Oti\n🏔️ Mont Agou (986m — plus haut sommet)'
  },
  // ===== JOURS DE MARCHÉ =====
  {
    keywords: ['jour de marché', 'grand marché', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
    response: '📅 Jours de marché au Togo :\n\n📍 Lomé : Mercredi et Samedi\n📍 Sokodé : Jeudi\n📍 Kara : Samedi\n📍 Dapaong : Lundi\n📍 Atakpamé : Samedi\n\n💡 Allez tôt le matin (5h-7h) pour les meilleurs produits !'
  },
  // ===== GÉOGRAPHIE =====
  {
    keywords: ['monde', 'afrique', 'continent', 'territoire', 'globe'],
    response: '🌍 Le Togo dans le monde :\n\n📍 Afrique de l\'Ouest\n🌍 56 785 km²\n👥 ~9 millions d\'habitants\n🌍 Voisins : Ghana, Bénin, Burkina Faso, Guinée\n🇹🇬 Indépendant depuis le 27 avril 1960'
  },
  // ===== AGRICULTURE EN GÉNÉRAL =====
  {
    keywords: ['agriculture', 'produire', 'production', 'fermier', 'agriculteur', 'agricole'],
    response: '🌱 L\'agriculture au Togo en bref :\n\n📊 Emploie 60% de la population active\n📊 Contribue à 40% du PIB\n\n🌾 Principales cultures :\n  • Céréales : maïs, riz, sorgho, mil\n  • Tubercules : igname, manioc, patate douce\n  • Légumineuses : niébé, arachide, soja\n  • Rentes : café, cacao, coton\n  • Maraîchage : tomate, piment, oignon\n\n💡 L\'agriculture togolaise a un immense potentiel !'
  },
  // ===== QUAND =====
  {
    keywords: ['quand', 'quelle saison'],
    response: '🌱 Calendrier agricole du Togo :\n\n📅 Jan-Mars : Préparation sols, récolte igname/manioc\n📅 Avr-Juin : Semis maïs, arachide, niébé, soja\n📅 Juil-Août : Désherbage, traitements\n📅 Sep-Oct : Récolte maïs, riz, arachide\n📅 Nov-Déc : Récolte igname, manioc, stockage\n\n💡 Precisez quel produit pour plus de détails !'
  },
  // ===== COMBIEN =====
  {
    keywords: ['combien', 'quelle quantite', 'quel prix', 'donne-moi'],
    response: '💡 Pour des prix précis, essayez :\n\n💰 "prix maïs", "prix tomate", "prix igname"\n🏪 "marché Lomé", "marché Sokodé"\n📍 "produits région Kara"\n\nConsultez aussi "Prix du Jour" sur TogoAgric !'
  },
  // ===== MERCI =====
  {
    keywords: ['merci beaucoup', 'je te remercie', 'thanks', 'thank you'],
    response: '🤝 De rien ! C\'est un plaisir de vous aider.\n\nN\'hésitez pas à revenir si vous avez d\'autres questions sur l\'agriculture au Togo ! 🌱'
  },
  // ===== ÉWÉ GREETINGS =====
  {
    keywords: ['akoe', 'akpe', 'woezo', 'kafo', 'ndi'],
    response: '🌿 Woezo ! Akpe mélé ! 🇹🇬\n\nNe AgriBot nye TogoAgric-ƒe agbalẽ. Migble aɖe :\n\n💰 Akpantsi\n🌿 Aƒu ƒome\n🏪 Xexeame\n🌤️ Eya\n\nFia nya nuwo o ! 🌱'
  },
  // ===== KABYÈ GREETINGS =====
  {
    keywords: ['kabri', 'kafu', 'lalàm', 'sawara'],
    response: '🌿 Kabri ! Kafu ! 🇹🇬\n\nNe AgriBot nye TogoAgric-ƒe agbalẽ. Migble aɖe :\n\n💰 Akpantsi\n🌿 Aƒu ƒome\n🏪 Xexeame\n🌤️ Eya\n\nFia nya nuwo o ! 🌱'
  },
  // ===== ADMIN =====
  {
    keywords: ['admin', 'administrateur', 'gestion', 'gerer', 'tableau de bord'],
    response: '👑 Administration TogoAgric :\n\n🔑 Compte admin : admin@togoagric.tg / admin123\n\nLe tableau de bord permet de :\n• Gérer les utilisateurs\n• Modérer le forum\n• Voir les statistiques\n• Gérer les alertes de prix'
  },
  // ===== FAVORIS =====
  {
    keywords: ['favori', 'favoris', 'sauvegarder', 'ajouter'],
    response: '⭐ Favoris sur TogoAgric :\n\nCliquez sur l\'étoile ⭐ à côté d\'un produit ou d\'une annonce pour l\'ajouter à vos favoris.\n\nVos favoris sont accessibles depuis votre profil.'
  },
  // ===== SÉCURITÉ =====
  {
    keywords: ['securité', 'sécurité', 'arnaque', 'vol', 'danger'],
    response: '🔒 Sécurité sur TogoAgric :\n\n⚠️ Méfiez-vous des offres trop basses\n✅ Vérifiez toujours le produit avant de payer\n✅ Utilisez T-Money/Flooz pour les paiements à distance\n✅ Signalez tout comportement suspect\n\n📱 Signalez au : +228 96 32 79 92'
  },
  // ===== PÊCHE =====
  {
    keywords: ['peche', 'pêche', 'pêcheur', 'filet', 'barque'],
    response: '🐟 Pêche au Togo :\n\n📍 Lac Togo — pêche artisanale\n📍 Fleuve Mono — tilapia, silure\n📍 Océan Atlantique — pêche industrielle\n\n💰 Barque motorisée : 500 000-2 000 000 FCFA\n💰 Filet : 25 000-100 000 FCFA\n\nLa pêche est une source de revenus importante !'
  },
  // ===== PHOSPHATE =====
  {
    keywords: ['phosphate', 'mine', 'miniere', 'minéral'],
    response: '⛏️ Mines du Togo :\n\n💎 Phosphates — ressource minière principale\n📍 Hahotoé-Kpogamé (Maritime)\n📊 2e producteur mondial de phosphate\n\nLe phosphate est utilisé comme engrais dans le monde entier.'
  },
  // ===== ÉCHANGE =====
  {
    keywords: ['echange', 'échange', 'troquer', 'barter'],
    response: '🔄 Échanges sur TogoAgric :\n\nVous pouvez proposer des échanges de produits via la Marketplace.\n\n💡 Publiez une annonce de type "Échange" en précisant ce que vous proposez et ce que vous recherchez.'
  },
  // ===== MALADIES HUMAINES =====
  {
    keywords: ['maladie', 'paludisme', 'malaria', 'fièvre', 'douleur', 'hospital', 'hôpital'],
    response: '🏥 Santé au Togo :\n\n⚠️ Le paludisme est la première cause de mortalité\n💡 Utilisez des moustiquaires imprégnées\n📍 CHU de Lomé — plus grand hôpital du pays\n📍 Hôpital régional dans chaque région\n\n📞 Urgences : 117\n\nPour des questions de santé, consultez un médecin.'
  },
  // ===== IMPÔT =====
  {
    keywords: ['impot', 'impôt', 'taxe', 'contribuable'],
    response: '🏛️ Impôts au Togo :\n\n📍 Direction Générale des Impôts (DGI)\n💡 Les petits agriculteurs bénéficient d\'exonérations\n📞 Contactez un centre des impôts pour plus d\'informations\n\n💡 L\'OBR (Office des Recettes) peut aider au recouvrement.'
  },
  // ===== SÉSAME =====
  {
    keywords: ['sesame', 'sésame', 'benne', 'graine de sesame'],
    response: '🫘 Le sésame au Togo — culture de rente en pleine expansion !\n\n💰 Prix : 400-600 FCFA/kg\n📍 Savanes, Centrale, Kara\n📅 Semis : mai-juillet, récolte : octobre-décembre\n💡 Rendement : 500-1 000 kg/ha\n🌍 Exporté vers l\'Europe, le Ghana, le Nigeria\n\n💡 Le sésame résiste bien à la sécheresse !'
  },
  // ===== CACAO DÉTAILLÉ =====
  {
    keywords: ['cacao details', 'cacaoyer', 'fermentation', 'torrefaction', 'fève de cacao', 'chocolat'],
    response: '🍫 Le cacao togolais en détail :\n\n📍 Régions : Plateaux (Atakpamé, Kloto, Agou, Akébou)\n📅 Semis : juin-juillet, récolte principale : oct-jan\n🌿 Variétés : Amelonado, Trinitario\n💡 Rendement : 400-800 kg/ha de fèches séchées\n🏭 Étapes : fermentation (6-7 jours) → séchage (10-14 jours) → torréfaction\n💰 Prix fèches : 800-1 200 FCFA/kg\n🌍 Exporté vers la France, l\'Italie, la Suisse\n💡 Le cacao biologique se vend 30% plus cher !'
  },
  // ===== AVOCAT =====
  {
    keywords: ['avocat', 'avocatier', 'palta'],
    response: '🥑 L\'avocat au Togo :\n\n💰 Prix : 200-500 FCFA/pièce (saison)\n📍 Plateaux (Kpalimé, Atakpamé), Maritime\n📅 Récolte : juin à octobre\n💡 Variétés : Hass, Fuerte, Lula\n💡 Rendement : 8-15 tonnes/ha\n🌍 La demande d\'avocat est en forte croissance en Europe !\n\n💡 Un avocatier produit 100-200 kg/an.'
  },
  // ===== GINGEMBRE =====
  {
    keywords: ['gingembre', 'gingembre', 'ginger', 'rhizome'],
    response: '🫚 Le gingembre au Togo :\n\n💰 Prix : 500-800 FCFA/kg\n📍 Maritime, Plateaux\n📅 Plantation : mars-avril, récolte : 8-10 mois\n💡 Rendement : 10-20 tonnes/ha\n💊 Propriétés médicinales : anti-nausée, anti-inflammatoire\n🏭 Transformé en poudre, huile essentielle, confiserie\n🌍 Forte demande d\'export vers l\'Europe !\n\n💡 Le gingembre rapporte 2-3x plus que le maïs par hectare !'
  },
  // ===== OKRA / GOMBO =====
  {
    keywords: ['gombo', 'okra', 'lady finger'],
    response: '🫛 Le gombo (okra) au Togo :\n\n💰 Prix : 200-400 FCFA/kg\n📍 Cultivé partout, surtout Maritime et Plateaux\n📅 Semis : avril-juin, récolte : 2-3 mois\n💡 Rendement : 5-10 tonnes/ha\n🥘 Utilisé dans les sauces togolaises\n💪 Riche en vitamines A, C, K et fibres\n\n💡 Le gombo se récolte tous les 2-3 jours pendant 2-3 mois !'
  },
  // ===== ÉLEVAGE PORCIN =====
  {
    keywords: ['porc', 'porcin', 'cochon', 'élevage porcin', 'truie'],
    response: '🐷 L\'élevage porcin au Togo :\n\n💰 Porc à l\'engraissement : 80 000-120 000 FCFA/tête\n💰 Porcelet sevré : 15 000-20 000 FCFA\n📅 Cycle : 6-8 mois\n📍 Partout au Togo, surtout Maritime et Plateaux\n💡 Aliment : son de maïs, drêche de brasserie, tourteaux\n💡 1 truie → 10 porcelets/portée, 2 portées/an\n\n💡 Investissement initial : 150 000-300 000 FCFA pour 5 porcs.'
  },
  // ===== PRODUCTION DE LAIT =====
  {
    keywords: ['lait', 'vache laitière', 'produire du lait', 'laiterie', 'fromage'],
    response: '🐄 Production laitière au Togo :\n\n💰 Lait pasteurisé : 600-900 FCFA/litre\n📍 Kara, Centrale (élevages modernes)\n🐄 Vaches laitières : races N\'Dama, Girolando\n💡 Production : 5-15 litres/vache/jour\n📊 Le Togo importe 80% de sa consommation de lait !\n🏢 Laiterie du Togo (Laito) — principale usine\n\n💡 L\'élevage de vaches laitières est une opportunité immense !'
  },
  // ===== AGROFORESTERIE =====
  {
    keywords: ['agroforesterie', 'arbre', 'arbres', 'reboisement', 'ombre', 'brise-vent'],
    response: '🌳 Agroforesterie au Togo :\n\n💡 Association arbres + cultures/élevage\n🌳 Espèces recommandées :\n  • Acacia (fixateur d\'azote, fourrage)\n  • Moringa (nutritionnel, croissance rapide)\n  • Leucaena (fourrage, engrais vert)\n  • Palmier (huile, ombre)\n  • Acacia Senegal (gomme arabique)\n\n💰 Avantages :\n  • Ombrage → +30% rendement cultures\n  • Fixation de l\'azote → moins d\'engrais\n  • Protection contre le vent et l\'érosion\n  • Bois de chauffage et fruits\n\n💡 10-20 arbres/ha = meilleure productivité !'
  },
  // ===== AGRICULTURE DIGITALE =====
  {
    keywords: ['digitale', 'technologie', 'technologie agricole', 'agritech', 'application', 'sms', 'gps'],
    response: '📱 Agriculture digitale au Togo :\n\n🌐 TogoAgric — Prix, météo, marketplace (c\'est nous !)\n📱 SMS agricole — alertes via ICAT/DRA\n🌍 OIMB — Observatoire des Inégalités Monétaires\n🛰️ GPS — délimitation des parcelles\n📊 Tableurs — gestion de l\'exploitation\n\n💡 Applications utiles :\n• e-Agro (conseils culture)\n• Weather & Crop (météo agricole)\n• Google Sheets (comptabilité)\n\n💡 Le téléphone est l\'outil n°1 de l\'agriculteur togolais !'
  },
  // ===== MARCHÉS FRONTALIERS =====
  {
    keywords: ['frontalier', 'frontiere', 'frontière', 'ghana', 'benin', 'bénin', 'transit', 'importer', 'exporter local'],
    response: '🌍 Marchés frontaliers du Togo :\n\n🇬🇭 Avec le Ghana :\n📍 Aflao (frontière Lomé)\n→ Export : ananas, manioc, légumes\n→ Import : riz, produits manufacturés\n🚗 Distance : 5 km du centre de Lomé\n\n🇧🇯 Avec le Bénin :\n📍 Hillacondji (frontière Maritime)\n📍 Noépé / Cinkassé\n→ Export : igname, cacao, piment\n→ Import : coton, légumes\n\n💡 Les marchés frontaliers offrent des prix 20-30% plus élevés !\n💡 TogoAgric Marketplace facilite ces échanges.'
  },
];

// ============================================
// FONCTIONS DE RECHERCHE ET RÉPONSE
// ============================================

function findResponse(message: string): { response: string; confidence: number } {
  const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const normalized = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (lower.includes(normalized)) {
        score += normalized.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore >= 2) {
    return { response: bestMatch.response, confidence: bestScore };
  }

  return { response: '', confidence: 0 };
}

// ============================================
// FALLBACK INTELLIGENT
// ============================================

const FALLBACK_RESPONSES = [
  '🤔 Je n\'ai pas trouvé de réponse précise. Mais je peux vous aider avec :\n\n💰 "prix maïs" — Prix des produits\n🌿 "cultiver tomate" — Conseils de culture\n🏪 "marché Lomé" — Marchés et régions\n🌤️ "météo" — Prévisions météo\n📱 "T-Money" — Paiement mobile\n🏦 "crédit" — Financement agricole\n\nEssayez l\'une de ces questions !',
  '🤔 Hmm, je ne suis pas sûr de comprendre. Voici ce que je connais bien :\n\n🌽 38+ produits agricoles et leurs prix\n📍 21 marchés dans 5 régions\n🌿 Conseils de culture et d\'élevage\n💳 Financement et microfinance\n🌍 Export et transformation\n\nReformulez votre question pour une meilleure réponse !',
  '🤔 Question intéressante ! Je connais surtout l\'agriculture au Togo.\n\nDemandez-moi sur :\n• Un produit (maïs, tomate, igname...)\n• Une région (Lomé, Sokodé, Kara...)\n• Un marché\n• Des conseils de culture\n• Le financement agricole\n\nJe ferai mon mieux ! 🌱',
];

// ============================================
// POST HANDLER
// ============================================

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    // Small delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

    // 1. Try local knowledge base
    const localResult = findResponse(message);
    if (localResult.confidence >= 2) {
      return NextResponse.json({ reply: localResult.response, source: 'local' });
    }

    // 2. Fallback response
    const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    return NextResponse.json({ reply: fallback, source: 'fallback' });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json({ reply: '⚠️ Désolé, une erreur est survenue. Veuillez réessayer.' });
  }
}
