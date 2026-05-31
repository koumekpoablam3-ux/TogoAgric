export type Language = 'fr' | 'ewe' | 'kab';

export interface Translations {
  [key: string]: { fr: string; ewe: string; kab: string };
}

const t: Translations = {
  // Navigation
  appTitle: { fr: 'TogoAgric', ewe: 'TogoAgric', kab: 'TogoAgric' },
  home: { fr: 'Accueil', ewe: 'E nya', kab: 'E lɛl' },
  prices: { fr: 'Prix du Jour', ewe: 'Nɔnɔme ƒe ŋkeke', kab: 'Nɔn d lɛl' },
  marketplace: { fr: 'Marketplace', ewe: 'Agbɛme', kab: 'Lub' },
  weather: { fr: 'Météo', ewe: 'Gbɔgbɔsesẽ', kab: 'Gbɔgbɔ' },
  directory: { fr: 'Annuaire', ewe: 'Nunana', kab: 'Nunana' },
  alerts: { fr: 'Alertes', ewe: 'Se ƒe kpeɖe', kab: 'Kpeɖe' },
  dashboard: { fr: 'Tableau de bord', ewe: 'Xexlemeƒe asime', kab: 'Lɛɛm asime' },
  profile: { fr: 'Profil', ewe: 'Mɔƒoƒo', kab: 'Mɔfum' },
  forum: { fr: 'Forum', ewe: 'Takpekpe', kab: 'Takape' },
  favorites: { fr: 'Favoris', ewe: 'Favoritewo', kab: 'Favoritn' },
  notifications: { fr: 'Notifications', ewe: 'Nɔnɔme siwo wo ɖo', kab: 'Nɔn si wudzi' },

  // Auth
  login: { fr: 'Connexion', ewe: 'Se ɖe ƒome', kab: 'Kpe ɛn' },
  register: { fr: 'Inscription', ewe: 'Ebe nɔ anyi', kab: 'Gblɛ ɛn' },
  email: { fr: 'Email', ewe: 'Email', kab: 'Email' },
  password: { fr: 'Mot de passe', ewe: 'Mɔɔ si wɔ', kab: 'Mɔ si wul' },
  confirmPassword: { fr: 'Confirmer le mot de passe', ewe: 'Yesi mɔɔ si wɔ', kab: 'Gɛn mɔ si wul' },
  name: { fr: 'Nom', ewe: 'ŋkɔ', kab: 'ŋkɔ' },
  namePlaceholder: { fr: 'Votre nom complet', ewe: 'ŋkɔ alesi nye', kab: 'ŋkɔ d sɛd' },
  phone: { fr: 'Téléphone', ewe: 'Telefoni', kab: 'Telefoni' },
  role: { fr: 'Rôle', ewe: 'Se', kab: 'Sɛ' },
  region: { fr: 'Région', ewe: 'Fia', kab: 'Fia' },
  forgotPassword: { fr: 'Mot de passe oublié ?', ewe: 'Wɔɖe mɔɔ sia ?', kab: 'Mɔ si fu yiln ?' },
  loginButton: { fr: 'Se connecter', ewe: 'Kpɔ ƒome', kab: 'Kpe ɛn' },
  registerButton: { fr: "S'inscrire", ewe: 'Wɔ ebe nye', kab: 'Gblɛ ɛn' },
  loginSuccess: { fr: 'Connexion réussie !', ewe: 'Gaŋe etɔ̃e !', kab: 'Kpe tɔn vwal !' },
  welcomeBack: { fr: 'Bon retour parmi nous', ewe: 'Wɔlɔ dzɔ nánɔ', kab: 'Wɔlɔ dzɔ nǎn' },
  loginError: { fr: 'Email ou mot de passe incorrect', ewe: 'Email ye mɔɔ si wɔ nye', kab: 'Email wo mɔ si wul nye' },
  registerSuccess: { fr: 'Inscription réussie !', ewe: 'Ebe anyi gaŋe !', kab: 'Gblɛ tɔn vwal !' },
  registerError: { fr: "Échec de l'inscription", ewe: 'Ebe anyi me gaŋe o', kab: 'Gblɛ me tɔn o' },
  accountCreated: { fr: 'Votre compte a été créé avec succès', ewe: 'Ebe anyi wɔaɖe gaŋe la', kab: 'Gblɛ wudzi tɔn vwal' },
  logout: { fr: 'Déconnexion', ewe: 'Tsɔ tsi trɔ yi', kab: 'Kpe yi' },
  farmer: { fr: 'Agriculteur', ewe: 'Agrikɔltʃa dɔwɔla', kab: 'Vwel wul' },
  buyer: { fr: 'Acheteur', ewe: 'Gbɔla', kab: 'Lɛln' },
  admin: { fr: 'Administrateur', ewe: 'Dunya nuti', kab: 'Dunyan' },
  users: { fr: 'Utilisateurs', ewe: 'Ame siwo wɔ se ɖe eŋu', kab: 'Yiln si kpe ɛn' },

  // Profile
  myListings: { fr: 'Mes annonces', ewe: 'Agbalẽwo me', kab: "Yiln k' ɛm" },
  noListings: { fr: 'Aucune annonce', ewe: 'Agbalẽ alesi mele o', kab: 'Yil si mele o' },
  noFavorites: { fr: 'Aucun favori', ewe: 'Favoriti alesi mele o', kab: 'Favorit si mele o' },
  noNotifications: { fr: 'Aucune notification', ewe: 'Nɔnɔme alesi mele o', kab: 'Nɔn si mele o' },
  markAllRead: { fr: 'Tout lire', ewe: 'Wo katá aga', kab: 'Kpaln katá' },
  myAlerts: { fr: 'Mes alertes', ewe: 'Kpeɖewo me', kab: "Kpeɖn k ɛm" },

  // Home
  heroTitle: { fr: 'La plateforme agricole du Togo', ewe: 'Togo ƒe agrikɔltʃa platefɔme', kab: 'Togo ʋuln ŋwvnfufɛ' },
  heroSubtitle: { fr: 'Prix en temps réel, météo, et marketplace pour les agriculteurs togolais', ewe: 'Nɔnɔme le afisia, gbɔgbɔsesẽ, kple agbɛme na Togo ƒe agrikɔltʃa dɔwɔla', kab: 'Nɔn le afisia, gbɔgbɔ, kple lub na Togo ʋuln' },
  searchPlaceholder: { fr: 'Rechercher un produit, un marché...', ewe: 'Dii ameŋutinya, agbɛme...', kab: 'Yvwl vwel, lub...' },
  todayTrends: { fr: 'Prix tendances du jour', ewe: 'Nɔnɔme ƒe tɔtrɔ ƒe ŋkeke sia', kab: 'Nɔn lɛl sɔd' },
  latestListings: { fr: 'Dernières annonces', ewe: 'Gbe ƒe agbalẽwo', kab: 'Yiln vwiln' },
  quickWeather: { fr: 'Météo rapide', ewe: 'Gbɔgbɔsesẽ vovovo', kab: 'Gbɔgbɔ sɔd' },
  popularProducts: { fr: 'Produits populaires', ewe: 'Ameŋutinya siwo wɔna', kab: 'Vwel sɔd' },
  products: { fr: 'Produits', ewe: 'Ameŋutinya', kab: 'Vwel' },
  markets: { fr: 'Marchés', ewe: 'Agbɛmewo', kab: 'Lub' },
  regions: { fr: 'Régions', ewe: 'Fiawo', kab: 'Fiawo' },
  listings: { fr: 'Annonces', ewe: 'Agbalẽwo', kab: 'Yiln' },

  // Prices
  priceDashboard: { fr: 'Tableau des prix', ewe: 'Xexleme ɖe ƒe nɔnɔme', kab: 'Lɛɛm nɔ̃n n dɛm' },
  allRegions: { fr: 'Toutes les régions', ewe: 'Fiawo katá', kab: 'Fiawo katá' },
  category: { fr: 'Catégorie', ewe: 'Takpekpe', kab: 'Taka' },
  allCategories: { fr: 'Toutes les catégories', ewe: 'Takpekpewo katá', kab: 'Takawo katá' },
  product: { fr: 'Produit', ewe: 'Ameŋutinya', kab: 'Vwel' },
  market: { fr: 'Marché', ewe: 'Agbɛme', kab: 'Lub' },
  price: { fr: 'Prix', ewe: 'Nɔnɔme', kab: 'Nɔn' },
  unit: { fr: 'Unité', ewe: 'Kpekpe', kab: 'Nwɛn' },
  variation: { fr: 'Variation', ewe: 'Tɔtrɔ', kab: 'Tɔtrɔ' },
  date: { fr: 'Date', ewe: 'Ũkeke', kab: 'Ũkeke' },
  listView: { fr: 'Vue liste', ewe: 'Xexeame nuwo', kab: 'Xexeame nù' },
  chartView: { fr: 'Vue graphique', ewe: 'Xexeame xexleme', kab: 'Xexeame lɛɛm' },
  priceComparison: { fr: 'Comparaison des prix par marché', ewe: 'Nɔnɔme ƒe dzeside le agbɛmewo me', kab: 'Nɔn kpekpe lub' },
  selectProduct: { fr: 'Sélectionner un produit', ewe: 'Tsɔ ameŋutinya', kab: 'Yi vwel' },

  // Marketplace
  createListing: { fr: 'Créer une annonce', ewe: 'Tsɔ agbalẽ aʋ', kab: 'Yil ʋl' },
  sale: { fr: 'Vente', ewe: 'Dzɔ', kab: 'Yi' },
  buy: { fr: 'Achat', ewe: 'Gblɔ', kab: 'Lɛl' },
  service: { fr: 'Service', ewe: 'Sɛvisi', kab: 'Sɛvis' },
  contact: { fr: 'Contacter', ewe: 'Ga na', kab: 'Kpe ɛ' },
  seller: { fr: 'Vendeur', ewe: 'Dziɖula', kab: 'Yiln' },
  quantity: { fr: 'Quantité', ewe: 'Sɔsɔ', kab: 'Sɔsɔ' },
  paymentMethod: { fr: 'Mode de paiement', ewe: 'Fiafa kpe', kab: 'Fiafa kpe' },
  listingTitle: { fr: "Titre de l'annonce", ewe: 'Agbalẽ ƒe tanya', kab: 'Yil tanya' },
  description: { fr: 'Description', ewe: 'Agbalẽxexe', kab: 'Kpaln' },
  sellerName: { fr: 'Nom du vendeur', ewe: 'Dziɖula ƒe ŋkɔ', kab: 'Yiln ŋkɔ' },
  sellerPhone: { fr: 'Téléphone', ewe: 'Telefoni', kab: 'Telefoni' },
  amount: { fr: 'Montant (FCFA)', ewe: 'Gbɔgbɔ (FCFA)', kab: 'Gbɔgbɔ (FCFA)' },
  search: { fr: 'Rechercher', ewe: 'Di', kab: 'Yvwl' },
  filterByType: { fr: 'Filtrer par type', ewe: 'Sia kpe ɖe se me', kab: 'Kpe se' },
  allTypes: { fr: 'Tous les types', ewe: 'Sewo katá', kab: 'Sewo katá' },

  // Weather
  weatherForecast: { fr: 'Prévisions météo', ewe: 'Gbɔgbɔsesẽ ƒe subɔsubɔ', kab: 'Gbɔgbɔ subɔ' },
  today: { fr: "Aujourd'hui", ewe: 'Lɛlia', kab: 'Lɛl' },
  humidity: { fr: 'Humidité', ewe: 'Nunɔamesi', kab: 'Nunɔ' },
  windSpeed: { fr: 'Vent', ewe: 'Gbɔ', kab: 'Gbɔ' },
  rainfall: { fr: 'Pluie', ewe: 'Vɔ', kab: 'Vɔ' },
  sunny: { fr: 'Ensoleillé', ewe: 'Gbɔ gbɔ', kab: 'Ywa ywa' },
  cloudy: { fr: 'Nuageux', ewe: 'Vevie', kab: 'Kpakpa' },
  rainy: { fr: 'Pluvieux', ewe: 'Vɔvɔ', kab: 'Vɔvɔ' },
  stormy: { fr: 'Orageux', ewe: 'Esime', kab: 'Esime' },
  agriculturalAdvice: { fr: 'Conseil agricole', ewe: 'Agrikɔltʃa ƒe gbedasi', kab: 'Vwel ʋuln gbedasi' },

  // Directory
  directoryMarkets: { fr: 'Marchés', ewe: 'Agbɛmewo', kab: 'Lub' },
  directoryFarmers: { fr: 'Exploitants', ewe: 'Dɔwɔlawo', kab: 'Vwel' },
  prefecture: { fr: 'Préfecture', ewe: 'Prefekti', kab: 'Prefekti' },
  averagePrice: { fr: 'Prix moyen', ewe: 'Nɔnɔme vovovo', kab: 'Nɔn vovov' },
  specialty: { fr: 'Spécialité', ewe: 'Gbeɖe', kab: 'Gbede' },
  rating: { fr: 'Note', ewe: 'Te', kab: 'Te' },

  // Alerts
  priceAlerts: { fr: 'Alertes de prix', ewe: 'Nɔnɔme ƒe kpeɖe', kab: 'Nɔn kpeɖe' },
  createAlert: { fr: 'Créer une alerte', ewe: 'Tsɔ kpeɖe aʋ', kab: 'Kpeɖe ʋl' },
  targetPrice: { fr: 'Prix cible (FCFA)', ewe: 'Nɔnɔme ƒe dzidzime (FCFA)', kab: 'Nɔn dzidzim (FCFA)' },
  whenPriceGoes: { fr: 'Quand le prix passe', ewe: 'Esi nɔnɔme yi', kab: 'Esi nɔn yi' },
  below: { fr: 'En dessous de', ewe: 'Le ƒo', kab: 'Fɔ' },
  above: { fr: 'Au dessus de', ewe: 'Le dzi', kab: 'Dzi' },
  activeAlerts: { fr: 'Alertes actives', ewe: 'Kpeɖe siwo le xexeame me', kab: 'Kpeɖe sɔd' },
  noAlerts: { fr: 'Aucune alerte active', ewe: 'Kpeɖe alesi mele o', kab: 'Kpeɖe si mele o' },
  alertTriggered: { fr: 'Alerte déclenchée !', ewe: 'Kpeɖe wu egbea !', kab: 'Kpeɖe wu egbea !' },

  // Forum
  createPost: { fr: 'Créer un post', ewe: 'Tsɔ takpekpe aʋ', kab: 'Takape ʋl' },
  searchForum: { fr: 'Rechercher dans le forum...', ewe: 'Dii le takpekpe me...', kab: 'Yvwl takap me...' },
  noForumPosts: { fr: 'Aucun post pour le moment', ewe: 'Takpekpe alesi mele o', kab: 'Takape si mele o' },
  forumCommunity: { fr: 'Communauté', ewe: 'Kɔmiuniti', kab: 'Kɔminit' },

  // Dashboard
  overview: { fr: 'Vue d\'ensemble', ewe: 'Xexeame me', kab: 'Xexeame nù' },
  management: { fr: 'Gestion', ewe: 'Ðɔdɔe', kab: 'Ðɔdɔe' },
  settings: { fr: 'Paramètres', ewe: 'Se xexeame', kab: 'Se xexeame' },
  activeAlerts: { fr: 'Alertes actives', ewe: 'Kpeɖe siwo le xexeame me', kab: 'Kpeɖe sɔd' },

  // Common
  fcfa: { fr: 'FCFA', ewe: 'FCFA', kab: 'FCFA' },
  loading: { fr: 'Chargement...', ewe: 'Gbɔna...', kab: 'Kpaln...' },
  noData: { fr: 'Aucune donnée', ewe: 'Data mele o', kab: 'Data si mele o' },
  cancel: { fr: 'Annuler', ewe: 'Dzudzɔ', kab: 'Dzudzɔ' },
  save: { fr: 'Enregistrer', ewe: 'Kpe ɖe eŋu', kab: 'Kpe ɛn' },
  submit: { fr: 'Soumettre', ewe: 'Ge ɖe go', kab: 'Ge ɛn' },
  close: { fr: 'Fermer', ewe: 'Wu', kab: 'Wu' },
};

export default t;

export function tValue(key: string, lang: Language): string {
  const entry = t[key];
  if (!entry) return key;
  return entry[lang] || entry.fr;
}
