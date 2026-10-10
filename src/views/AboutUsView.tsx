import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  Leaf, 
  Users, 
  Heart, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  Globe, 
  Award,
  ArrowRight
} from 'lucide-react';

export const AboutUsView: React.FC = () => {
  const { navigateTo } = useApp();

  const teamMembers = [
    {
      name: "Dr. Maya Lin",
      role: "Founder & Agricultural Systems Lead",
      bio: "Former regional extension agent with 15+ years connecting urban communities with organic family farms.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Julian Rivera",
      role: "Community Market Coordinator",
      bio: "Organizes weekly volunteer vendor audits and SNAP/Double-Up token programs across metropolitan districts.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Aisha Patel",
      role: "Lead Platform Engineer & UX",
      bio: "Passionate about building fast, accessible, 100% client-side web tools that empower local food networks.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Carlos Mendez",
      role: "Grower Relations & Produce Guide Curator",
      bio: "Third-generation orchardist ensuring variety and harvest calendars reflect actual field conditions.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-16">
      
      {/* Header Banner */}
      <div className="border-b border-emerald-100 pb-8 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span>About FreshFind · Theme: eGreen Basket</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-stone-900 tracking-tight">
          Bringing The Market Closer To Every Table
        </h1>

        <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
          &ldquo;Fresh All Along&rdquo; — Born out of a simple need: replacing messy, torn street flyers with a fast, reliable, beautiful digital companion for every farmers market shopper.
        </p>
      </div>

      {/* The Problem & Our Solution (SRS Background Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>The Background &amp; Necessity</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 leading-snug">
            Why We Built FreshFind
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Farmers markets play an indispensable role in connecting communities with the independent growers who put fresh, seasonal nutrition on their tables.
          </p>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            However, information on market locations, opening days, seasonal produce availability, and operating hours has historically been scattered across bulletin boards, out-of-date social feeds, and hearsay.
          </p>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            FreshFind consolidates this essential community data into one accessible, browser-based Single Page Application with zero server storage overhead, real-time operating hours, and helpful rule-based guidance.
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigateTo('directory')}
              className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-md"
            >
              <span>Explore Our Verified Markets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-emerald-100 bg-stone-100">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
              alt="Farmers market produce stall"
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xl max-w-xs hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                100%
              </div>
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">Verified Open Schedules</span>
                <span className="text-stone-500">Updated weekly with local organizers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values & Pillars */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold">
            The eGreen Basket Code
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif mt-1">
            Our Four Guiding Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-emerald-950/60 p-6 rounded-2xl border border-emerald-800/80 space-y-2">
            <Sprout className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-base font-serif">Radical Freshness</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Produce picked in local fields hours before you arrive, retaining max vitamins and unadulterated flavor.
            </p>
          </div>

          <div className="bg-emerald-950/60 p-6 rounded-2xl border border-emerald-800/80 space-y-2">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-base font-serif">Zero Food Miles</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Drastically reducing shipping emissions and single-use packaging with reusable basket shopping.
            </p>
          </div>

          <div className="bg-emerald-950/60 p-6 rounded-2xl border border-emerald-800/80 space-y-2">
            <Heart className="w-6 h-6 text-rose-400" />
            <h3 className="font-bold text-base font-serif">Community Wealth</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              90% of every dollar spent stays within the local regional agricultural economy and family farms.
            </p>
          </div>

          <div className="bg-emerald-950/60 p-6 rounded-2xl border border-emerald-800/80 space-y-2">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
            <h3 className="font-bold text-base font-serif">Food Inclusivity</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Highlighting SNAP/EBT and nutrition incentive programs so healthy organic produce is accessible to all.
            </p>
          </div>
        </div>
      </div>

      {/* Team / Ambassadors Section (SRS Requirement) */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>People Behind The Platform</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-1">
            Meet the FreshFind Team
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Agronomists, civic coders, and market organizers united in service of our local food system.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-sm p-5 space-y-4 text-center hover:shadow-md transition-shadow"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-2xl object-cover mx-auto shadow-xs border border-stone-200"
              />
              <div className="space-y-1">
                <h3 className="font-bold font-serif text-stone-900 text-base">
                  {member.name}
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 block">
                  {member.role}
                </span>
                <p className="text-xs text-stone-500 pt-1 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
