import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight, Home } from 'lucide-react';
import { PageView } from '../types';

interface BreadcrumbItem {
  label: string;
  page?: PageView;
  targetId?: string;
  isCurrent?: boolean;
}

export const Breadcrumbs: React.FC = () => {
  const { currentPage, selectedMarketId, selectedProduceId, markets, produceList, navigateTo } = useApp();

  if (currentPage === 'home') {
    return null;
  }

  const items: BreadcrumbItem[] = [
    { label: 'Home', page: 'home' }
  ];

  if (currentPage === 'directory') {
    items.push({ label: 'Market Directory', isCurrent: true });
  } else if (currentPage === 'market-detail') {
    items.push({ label: 'Market Directory', page: 'directory' });
    const market = markets.find(m => m.id === selectedMarketId);
    items.push({ label: market ? market.name : 'Market Details', isCurrent: true });
  } else if (currentPage === 'produce-guide') {
    items.push({ label: 'Produce Guide', isCurrent: true });
  } else if (currentPage === 'seasonal') {
    items.push({ label: 'Seasonal Recommendations', isCurrent: true });
  } else if (currentPage === 'bookmarks') {
    items.push({ label: 'Saved Basket & Bookmarks', isCurrent: true });
  } else if (currentPage === 'contact') {
    items.push({ label: 'Contact Us', isCurrent: true });
  } else if (currentPage === 'about') {
    items.push({ label: 'About Us', isCurrent: true });
  }

  return (
    <nav aria-label="Breadcrumb" className="bg-emerald-50/60 border-b border-emerald-100/60 py-2.5 px-4 sm:px-6 lg:px-8 text-xs sm:text-sm text-stone-600">
      <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            )}
            {item.isCurrent ? (
              <span className="font-semibold text-emerald-900 truncate max-w-xs sm:max-w-md" aria-current="page">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => item.page && navigateTo(item.page)}
                className="hover:text-emerald-700 transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                {index === 0 && <Home className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};
