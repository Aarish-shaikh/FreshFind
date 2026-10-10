/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Chatbot } from './components/Chatbot';
import { AuthModal } from './components/AuthModal';
import { Toasts } from './components/Toasts';

import { HomeView } from './views/HomeView';
import { MarketDirectoryView } from './views/MarketDirectoryView';
import { MarketDetailView } from './views/MarketDetailView';
import { ProduceGuideView } from './views/ProduceGuideView';
import { SeasonalRecommendationsView } from './views/SeasonalRecommendationsView';
import { BookmarksView } from './views/BookmarksView';
import { ContactUsView } from './views/ContactUsView';
import { AboutUsView } from './views/AboutUsView';

const MainContent: React.FC = () => {
  const { currentPage } = useApp();

  const renderView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView />;
      case 'directory':
        return <MarketDirectoryView />;
      case 'market-detail':
        return <MarketDetailView />;
      case 'produce-guide':
        return <ProduceGuideView />;
      case 'seasonal':
        return <SeasonalRecommendationsView />;
      case 'bookmarks':
        return <BookmarksView />;
      case 'contact':
        return <ContactUsView />;
      case 'about':
        return <AboutUsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 text-stone-800">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {renderView()}
      </main>

      <Footer />

      {/* Cross-page interactive elements */}
      <Chatbot />
      <AuthModal />
      <Toasts />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
