'use client';
import { Sprout, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart, ExternalLink, MessageCircle } from 'lucide-react';

interface FooterProps {
  lang: 'fr' | 'ewe' | 'kab';
}

export default function Footer({ lang }: FooterProps) {
  const isFr = lang === 'fr';

  const socialLinks = [
    { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/22896327992', color: 'hover:bg-green-600' },
    { icon: Facebook, label: 'Facebook', href: '#', color: 'hover:bg-blue-600' },
    { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:bg-sky-500' },
    { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:bg-pink-600' },
    { icon: Linkedin, label: 'LinkedIn', href: '#', color: 'hover:bg-blue-700' },
  ];

  const quickLinks = [
    { label: isFr ? 'Accueil' : 'Home', emoji: '🏠', tab: 'home' },
    { label: isFr ? 'Prix du Jour' : 'Today Prices', emoji: '💰', tab: 'prices' },
    { label: isFr ? 'Marketplace' : 'Marketplace', emoji: '🏪', tab: 'marketplace' },
    { label: isFr ? 'Météo' : 'Weather', emoji: '🌤️', tab: 'weather' },
    { label: isFr ? 'Forum' : 'Forum', emoji: '💬', tab: 'forum' },
    { label: isFr ? 'Annuaires' : 'Directory', emoji: '📖', tab: 'directory' },
  ];

  const resourceLinks = [
    { label: isFr ? 'Alertes de prix' : 'Price Alerts', emoji: '🔔' },
    { label: isFr ? 'Tableau de bord' : 'Dashboard', emoji: '📊' },
    { label: isFr ? 'Calendrier agricole' : 'Agricultural Calendar', emoji: '📅' },
    { label: isFr ? 'Guide des cultures' : 'Crop Guide', emoji: '🌱' },
  ];

  return (
    <footer className="bg-gradient-to-b from-green-900 to-gray-950 text-gray-300 mt-auto">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">

          {/* Brand & About — spans 4 cols */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/30">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-lg flex items-center gap-1.5">
                  TogoAgric
                  <span className="text-sm">🇹🇬</span>
                </span>
                <p className="text-[10px] text-green-400 font-medium -mt-0.5">v7.0 — Plateforme Agricole</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-4">
              {isFr
                ? 'La plateforme agricole N°1 du Togo. Prix en temps réel, météo, marketplace et outils pour les agriculteurs togolais.'
                : 'Togo\'s #1 agricultural platform. Real-time prices, weather, marketplace and tools for Togolese farmers.'}
            </p>
            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className={`w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${social.color} hover:text-white transition-all duration-200`}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links — spans 2 cols */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {isFr ? 'Navigation' : 'Navigation'}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <span className="hover:text-green-400 cursor-pointer transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="text-xs">{link.emoji}</span>
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources — spans 2 cols */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {isFr ? 'Ressources' : 'Resources'}
            </h3>
            <ul className="space-y-2.5">
              {resourceLinks.map((link, i) => (
                <li key={i}>
                  <span className="hover:text-green-400 cursor-pointer transition-colors text-sm flex items-center gap-1.5">
                    <span className="text-xs">{link.emoji}</span>
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — spans 4 cols */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {isFr ? 'Contact' : 'Contact'}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{isFr ? 'Téléphone' : 'Phone'}</p>
                  <span className="text-gray-300">+228 96 32 79 92</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{isFr ? 'Email' : 'Email'}</p>
                  <span className="text-gray-300 break-all">koumekpoablam3@gmail.com</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{isFr ? 'Adresse' : 'Address'}</p>
                  <span className="text-gray-300">Lomé, Togo — Afrique de l&apos;Ouest</span>
                </div>
              </li>
            </ul>
            {/* Mini CTA */}
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-gray-400 leading-relaxed">
                {isFr
                  ? '💡 TogoAgric connecte les agriculteurs, les acheteurs et les marchés du Togo pour une agriculture plus efficace et profitable.'
                  : '💡 TogoAgric connects farmers, buyers, and markets across Togo for more efficient and profitable agriculture.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            © {new Date().getFullYear()} TogoAgric — Créé par KOUMEKPO Ablam. {isFr ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            {isFr ? 'Fait avec' : 'Made with'} <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {isFr ? 'au Togo 🇹🇬' : 'in Togo 🇹🇬'}
          </p>
        </div>
      </div>
    </footer>
  );
}
