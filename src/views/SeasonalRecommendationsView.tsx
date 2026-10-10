import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Calendar, 
  Sun, 
  CloudRain, 
  Snowflake, 
  Flame, 
  Leaf, 
  Heart, 
  Apple, 
  ChevronRight, 
  Utensils, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { getCurrentSeason } from '../utils/schedule';
import { Season } from '../types';

export const SeasonalRecommendationsView: React.FC = () => {
  const { 
    produceList, 
    markets, 
    currentTime, 
    navigateTo, 
    toggleBookmark, 
    isBookmarked 
  } = useApp();

  const detectedSeason = getCurrentSeason(currentTime);
  const [activeSeason, setActiveSeason] = useState<Season>(detectedSeason);

  const seasonalPicks = produceList.filter(p => 
    p.season.includes(activeSeason) || p.season.includes('Year-Round')
  );

  const seasonMeta: Record<Season, {
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    accentBg: string;
    months: string;
    tips: string[];
    pairings: { title: string; ingredients: string; desc: string }[];
  }> = {
    Autumn: {
      title: 'Autumn Harvest & Orchard Season',
      description: 'Cider pressing, crisp heirloom apples, earthy wild forest chanterelles, and golden cured winter squashes. Autumn brings grounding flavors and cozy comfort foods.',
      icon: Leaf,
      accentBg: 'from-amber-600 to-orange-800',
      months: 'September – November',
      tips: [
        'Look for apples with tight skin and intact stems for optimal cellar longevity.',
        'Hard winter squashes like Butternut and Kabocha develop richer sweetness when cured in a dry spot for 2 weeks.',
        'Pacific wild mushrooms should be dry-brushed rather than soaked in water.'
      ],
      pairings: [
        {
          title: 'Roasted Butternut Squash & Goat Cheese Crostini',
          ingredients: 'Butternut Squash + Artisanal Chevre + Wildflower Honey + Sourdough Boule',
          desc: 'Toss diced squash in olive oil and roast at 400°F until caramelized. Spread tangy chevre onto toasted sourdough and drizzle with raw mountain honey.'
        },
        {
          title: 'Wild Chanterelle & Sweet Herb Saute',
          ingredients: 'Chanterelle Mushrooms + Fresh Thyme & Sage + Pasture Butter',
          desc: 'Dry-sear torn chanterelles in a cast iron skillet until moisture evaporates, then finish with foaming pasture butter and freshly picked herbs.'
        }
      ]
    },
    Winter: {
      title: 'Winter Storage Roots & Cold-Hardy Greens',
      description: 'Sweetened by natural frost, winter brings cold-hardy brassicas, crisp cellared apples, hearty heritage root vegetables, and fragrant citrus.',
      icon: Snowflake,
      accentBg: 'from-sky-700 to-slate-800',
      months: 'December – February',
      tips: [
        'Frost transforms starches into sugars in winter kales and carrots.',
        'Keep root vegetables cool and slightly humid for months of freshness.',
        'Warm raw honey gently in a water bath if natural crystallization occurs.'
      ],
      pairings: [
        {
          title: 'Caramelized Root Vegetable & Spelt Bowl',
          ingredients: 'Golden Beets + French Carrots + Sourdough + Hard Cheese',
          desc: 'Slow roast root medley with cracked peppercorns and serve atop warm grains with shaved aged farmstead cheddar.'
        }
      ]
    },
    Spring: {
      title: 'Spring Awakening & Tender Shoots',
      description: 'Vibrant baby radishes, sweet sugar snap peas, peppery field greens, tender green garlic, and fresh goat curd.',
      icon: CloudRain,
      accentBg: 'from-emerald-600 to-teal-800',
      months: 'March – May',
      tips: [
        'Eat spring greens within 48 hours of harvest for peak Vitamin C.',
        'Keep radish tops fresh by separating them from roots upon returning from market.',
        'Look for pasture eggs with rich orange yolks as hens return to fresh clover.'
      ],
      pairings: [
        {
          title: 'French Breakfast Radish Tartine',
          ingredients: 'Radishes + Pasture Butter + Sea Salt + Sourdough',
          desc: 'Classic market ritual: crisp sliced radishes layered over cultured room-temp butter and crusty bread.'
        }
      ]
    },
    Summer: {
      title: 'Summer Abundance & Sun-Ripened Fruit',
      description: 'Explosive heirloom vine tomatoes, sweet Genovese basil, fragile mountain berries, sweet corn, and crisp cucumbers.',
      icon: Sun,
      accentBg: 'from-yellow-500 to-amber-700',
      months: 'June – August',
      tips: [
        'Never refrigerate ripe heirloom tomatoes; cold destroys volatile aromatic flavor compounds.',
        'Berries should only be rinsed immediately before serving.',
        'Store fresh basil stems in a jar of room-temperature water like fresh flowers.'
      ],
      pairings: [
        {
          title: 'Vine-Ripened Caprese Salad',
          ingredients: 'Heirloom Brandywine + Fresh Basil + Artisanal Chevre + Cold-Pressed Oil',
          desc: 'Slice room-temperature tomatoes thickly, tuck in torn fresh basil leaves, and crumble fresh curd cheese.'
        }
      ]
    },
    'Year-Round': {
      title: 'Year-Round Staples & Farmstead Pantry',
      description: 'Naturally fermented sourdough loaves, raw wildflower honey, pastured heritage eggs, and cave-aged dairy cheeses available consistently.',
      icon: Flame,
      accentBg: 'from-emerald-700 to-stone-800',
      months: 'All 12 Months',
      tips: [
        'Support egg and dairy producers during winter when production costs rise.',
        'Stock up on raw local honey to support regional pollinators.'
      ],
      pairings: [
        {
          title: 'Farmhouse Breakfast Platter',
          ingredients: 'Pasture Eggs + Sourdough + Farmstead Cheese + Mountain Honey',
          desc: 'Sunny side up pasture eggs served with toasted artisan sourdough and a wedge of raw milk cheddar.'
        }
      ]
    }
  };

  const currentMeta = seasonMeta[activeSeason];
  const SeasonIcon = currentMeta.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="border-b border-emerald-100 pb-6">
        <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Natural Agricultural Cycles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900 mt-1">
          Seasonal Recommendations
        </h1>
        <p className="text-stone-600 text-sm mt-1 max-w-2xl">
          Eating with the seasons guarantees denser nutrients, unmatched flavor, and minimal transport emissions. Explore what is ripe right now.
        </p>

        {/* Real-time season highlight notice */}
        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 text-emerald-700" />
          <span>Real-Time System Detected: <strong>{detectedSeason} Harvest</strong> ({currentTime.toLocaleDateString([], { month: 'long' })})</span>
        </div>
      </div>

      {/* Interactive Season Switcher Tabs */}
      <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-wrap gap-1.5">
        {(['Spring', 'Summer', 'Autumn', 'Winter'] as Season[]).map(seasonName => {
          const isSelected = activeSeason === seasonName;
          const isDetected = detectedSeason === seasonName;

          return (
            <button
              key={seasonName}
              onClick={() => setActiveSeason(seasonName)}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <span>{seasonName}</span>
              {isDetected && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-emerald-600 text-emerald-100' : 'bg-emerald-100 text-emerald-800'}`}>
                  Now
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Spotlight Season Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 text-white bg-gradient-to-r ${currentMeta.accentBg} shadow-lg relative overflow-hidden`}>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-white/90 text-xs font-semibold uppercase tracking-wider">
            <SeasonIcon className="w-4 h-4" />
            <span>{currentMeta.months}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold font-serif">
            {currentMeta.title}
          </h2>

          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            {currentMeta.description}
          </p>
        </div>
      </div>

      {/* Seasonal Produce Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-serif text-stone-900">
            {activeSeason} Peak Harvest Items ({seasonalPicks.length})
          </h3>
          <button
            onClick={() => navigateTo('produce-guide')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>Full Produce Catalogue</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonalPicks.map(item => {
            const bookmarked = isBookmarked('produce', item.id);
            const carryingMarkets = markets.filter(m => item.marketIds.includes(m.id));

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => toggleBookmark('produce', item.id)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 shadow-sm transition-colors"
                      title="Bookmark item"
                    >
                      <Heart className={`w-3.5 h-3.5 ${bookmarked ? 'fill-rose-600 text-rose-600' : ''}`} />
                    </button>
                    <span className="absolute bottom-2 left-2 text-2xl drop-shadow-md">
                      {item.icon}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h4 className="text-base font-bold font-serif text-stone-900">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="text-[11px] text-stone-500 mb-2">
                    At: {carryingMarkets.map(m => m.name.split(' ')[0]).join(', ')}
                  </div>
                  <button
                    onClick={() => navigateTo('produce-guide', { produceId: item.id })}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View Guide Entry</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seasonal Tips & Recipe Pairings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Left 6 cols: Storage & Selection Tips */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>Farmstand Wisdom</span>
          </div>
          <h3 className="text-xl font-bold font-serif text-stone-900">
            {activeSeason} Shopping &amp; Selection Tips
          </h3>

          <ul className="space-y-3 pt-2">
            {currentMeta.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right 6 cols: Seasonal Recipe Pairings */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Utensils className="w-4 h-4 text-emerald-600" />
            <span>Culinary Creations</span>
          </div>
          <h3 className="text-xl font-bold font-serif text-stone-900">
            {activeSeason} Market Basket Pairings
          </h3>

          <div className="space-y-4 pt-2">
            {currentMeta.pairings.map((pair, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                <h4 className="font-bold text-stone-900 text-sm font-serif">{pair.title}</h4>
                <p className="text-[11px] font-semibold text-emerald-800">{pair.ingredients}</p>
                <p className="text-xs text-stone-600 leading-relaxed">{pair.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
