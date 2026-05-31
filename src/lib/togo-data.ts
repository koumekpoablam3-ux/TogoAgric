export const PRODUCT_CATEGORIES = [
  { id: 'cereales', label: 'Céréales', emoji: '🌾' },
  { id: 'tubercules', label: 'Tubercules', emoji: '🥔' },
  { id: 'legumes', label: 'Légumes', emoji: '🥬' },
  { id: 'fruits', label: 'Fruits', emoji: '🥭' },
  { id: 'betail', label: 'Bétail', emoji: '🐄' },
  { id: 'poisson', label: 'Poissons', emoji: '🐟' },
  { id: 'produits_transformes', label: 'Produits transformés', emoji: '🫙' },
] as const;

export const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', emoji: '💵' },
  { id: 't-money', label: 'T-Money', emoji: '📱' },
  { id: 'flooz', label: 'Moov Money (Flooz)', emoji: '📱' },
] as const;

export const LISTING_TYPES = [
  { id: 'vente', label: 'Vente', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { id: 'achat', label: 'Achat', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { id: 'service', label: 'Service', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
] as const;

export const WEATHER_CONDITIONS: Record<string, { label: string; emoji: string; color: string }> = {
  ensoleille: { label: 'Ensoleillé', emoji: '☀️', color: 'text-yellow-500' },
  nuageux: { label: 'Nuageux', emoji: '☁️', color: 'text-gray-500' },
  pluvieux: { label: 'Pluvieux', emoji: '🌧️', color: 'text-blue-500' },
  orageux: { label: 'Orageux', emoji: '⛈️', color: 'text-purple-500' },
};

export const WEATHER_ADVICE: Record<string, string> = {
  ensoleille: "Conditions idéales pour le séchage des produits et la récolte. Assurez-vous d'arroser vos cultures.",
  nuageux: "Temps couvert, bon pour les travaux de transplantation. Surveillez l'évolution météo.",
  pluvieux: "Jour de pluie — favorable pour les cultures pluviales. Évitez les récoltes et le séchage au sol.",
  orageux: "Alerte orage — protégez vos cultures sensibles et évitez de travailler en plein champ.",
};

export const SAMPLE_FARMERS = [
  { name: 'Kossi Amouzou', region: 'Centrale', specialty: 'Céréales & Tubercules', rating: 4.5, emoji: '👨‍🌾' },
  { name: 'Afi Mensah', region: 'Maritime', specialty: 'Légumes & Fruits', rating: 4.8, emoji: '👩‍🌾' },
  { name: 'Tchao Palouki', region: 'Kara', specialty: 'Igname & Bétail', rating: 4.2, emoji: '👨‍🌾' },
  { name: 'Adjo Dzokoto', region: 'Plateaux', specialty: 'Café & Cacao', rating: 4.6, emoji: '👩‍🌾' },
  { name: 'Esso Kpelou', region: 'Maritime', specialty: 'Transport agricole', rating: 4.3, emoji: '🚜' },
  { name: 'Bouraïma Ouro', region: 'Savanes', specialty: 'Bétail & Coton', rating: 4.7, emoji: '👨‍🌾' },
  { name: 'Akossiwa Koffi', region: 'Plateaux', specialty: 'Huile de palme', rating: 4.4, emoji: '👩‍🌾' },
  { name: 'Mawunyo Agbo', region: 'Maritime', specialty: 'Pêche & Poisson fumé', rating: 4.1, emoji: '👨‍🌾' },
];
