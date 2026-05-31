'use client';
import { useState } from 'react';
import { Language } from '@/lib/i18n';
import Header from '@/components/togo-agric/header';
import Footer from '@/components/togo-agric/footer';
import HomeSection from '@/components/togo-agric/home-section';
import PricesSection from '@/components/togo-agric/prices-section';
import MarketplaceSection from '@/components/togo-agric/marketplace-section';
import WeatherSection from '@/components/togo-agric/weather-section';
import DirectorySection from '@/components/togo-agric/directory-section';
import ForumSection from '@/components/togo-agric/forum-section';
import AlertsSection from '@/components/togo-agric/alerts-section';
import DashboardSection from '@/components/togo-agric/dashboard-section';
import ProfileSection from '@/components/togo-agric/profile-section';
import AuthDialog from '@/components/togo-agric/auth-dialog';
import NotificationBell from '@/components/togo-agric/notification-bell';
import CreateListingDialog from '@/components/togo-agric/create-listing-dialog';
import Chatbot from '@/components/togo-agric/chatbot';

export default function Page() {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState<Language>('fr');
  const [authOpen, setAuthOpen] = useState(false);
  const [listingOpen, setListingOpen] = useState(false);

  const renderSection = () => {
    switch (activeTab) {
      case 'home': return <HomeSection lang={lang} onNavigate={setActiveTab} />;
      case 'prices': return <PricesSection lang={lang} />;
      case 'marketplace': return <MarketplaceSection lang={lang} onCreateListing={() => setListingOpen(true)} />;
      case 'weather': return <WeatherSection lang={lang} />;
      case 'directory': return <DirectorySection lang={lang} />;
      case 'forum': return <ForumSection lang={lang} />;
      case 'alerts': return <AlertsSection lang={lang} />;
      case 'dashboard': return <DashboardSection lang={lang} />;
      case 'profile': return <ProfileSection lang={lang} />;
      default: return <HomeSection lang={lang} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        lang={lang}
        onLangChange={setLang}
        onLoginClick={() => setAuthOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {renderSection()}
      </main>

      <Footer lang={lang} />

      <AuthDialog isOpen={authOpen} onClose={() => setAuthOpen(false)} lang={lang} />
      <CreateListingDialog isOpen={listingOpen} onClose={() => setListingOpen(false)} onCreated={() => {}} lang={lang} />

      {/* Chatbot IA */}
      <Chatbot />
    </div>
  );
}
