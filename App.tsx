
import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { ParkingCard } from './components/ParkingCard.tsx';
import { AssistantDrawer } from './components/AssistantDrawer.tsx';
import { ViewMode, ParkingSpot, GroundingSource } from './types.ts';
import { MOCK_SPOTS } from './constants.tsx';
import { getParkingInsights } from './services/geminiService.ts';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.HOME);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [insights, setInsights] = useState<{ text: string, sources: GroundingSource[] } | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setView(ViewMode.LISTING_DETAIL);
    window.scrollTo(0, 0);
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoadingInsights(true);
    setView(ViewMode.SEARCH);
    const result = await getParkingInsights(searchQuery);
    setInsights(result);
    setLoadingInsights(false);
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <Navbar onNavigate={setView} currentView={view} />
      
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-8">
        {view === ViewMode.HOME && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gray-900 py-24 px-8 md:px-16 animate-slide-up">
              <img 
                src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=2000" 
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                alt="Parking background"
              />
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                  Your car's perfect stay is just a click away.
                </h1>
                <div className="flex flex-col md:flex-row gap-3 bg-white p-2 rounded-2xl md:rounded-full shadow-2xl">
                  <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
                    <i className="fas fa-search text-gray-400"></i>
                    <input 
                      type="text" 
                      placeholder="Where are you going?"
                      className="w-full bg-transparent outline-none text-gray-900 font-medium"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                    />
                  </div>
                  <button 
                    onClick={performSearch}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl md:rounded-full font-bold hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Tags */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {['Underground', 'EV Charging', 'CCTV', 'Overnight', 'Valet', 'Monthly'].map(tag => (
                <button key={tag} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-sm font-medium">
                  {tag}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {MOCK_SPOTS.map(spot => (
                <ParkingCard key={spot.id} spot={spot} onClick={handleSpotClick} />
              ))}
            </div>
          </div>
        )}

        {view === ViewMode.SEARCH && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => setView(ViewMode.HOME)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <h2 className="text-2xl font-bold">Parking in {searchQuery || 'your area'}</h2>
            </div>

            {/* AI Insights Card */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 text-indigo-700 font-bold mb-3">
                <i className="fas fa-sparkles"></i>
                AI Market Analysis
              </div>
              
              {loadingInsights ? (
                <div className="space-y-3">
                  <div className="h-4 bg-indigo-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-indigo-200 rounded animate-pulse w-1/2"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{insights?.text || "Searching for the best deals and locations..."}</p>
                  {insights?.sources && insights.sources.length > 0 && (
                    <div className="pt-4 border-t border-indigo-200">
                      <p className="text-xs font-bold text-indigo-600 uppercase mb-2">Sources</p>
                      <div className="flex flex-wrap gap-3">
                        {insights.sources.map((src, i) => (
                          <a 
                            key={i} 
                            href={src.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-500 hover:underline flex items-center gap-1"
                          >
                            <i className="fas fa-link text-[10px]"></i> {src.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {MOCK_SPOTS.map(spot => (
                <ParkingCard key={spot.id} spot={spot} onClick={handleSpotClick} />
              ))}
            </div>
          </div>
        )}

        {view === ViewMode.LISTING_DETAIL && selectedSpot && (
          <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">
             <button 
                onClick={() => setView(ViewMode.HOME)}
                className="flex items-center gap-2 font-semibold hover:underline"
              >
                <i className="fas fa-chevron-left"></i> Back to search
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-3xl overflow-hidden aspect-video md:aspect-auto h-[400px]">
                  <img src={selectedSpot.image} className="w-full h-full object-cover" alt={selectedSpot.title} />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedSpot.title}</h1>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <i className="fas fa-star text-indigo-600"></i> {selectedSpot.rating}
                      </span>
                      <span>{selectedSpot.reviews} reviews</span>
                      <span className="underline font-medium">{selectedSpot.location}</span>
                    </div>
                  </div>

                  <div className="border-t border-b border-gray-100 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={selectedSpot.owner.avatar} className="w-12 h-12 rounded-full" alt={selectedSpot.owner.name} />
                      <div>
                        <p className="font-bold">Hosted by {selectedSpot.owner.name}</p>
                        <p className="text-sm text-gray-500">Superhost • 4 years hosting</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">What this spot offers</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedSpot.features.map(f => (
                        <div key={f} className="flex items-center gap-3 text-gray-700">
                          <i className={`fas ${f === 'CCTV' ? 'fa-video' : f === 'Underground' ? 'fa-warehouse' : 'fa-check'} text-indigo-600 w-5`}></i>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-3xl shadow-xl space-y-4 sticky top-24">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold">${selectedSpot.pricePerHour.toFixed(2)} / hour</span>
                      <span className="text-gray-500 underline text-sm">{selectedSpot.reviews} reviews</span>
                    </div>
                    
                    <div className="grid grid-cols-2 border border-gray-400 rounded-xl overflow-hidden text-xs">
                      <div className="p-2 border-r border-gray-400">
                        <label className="block font-bold uppercase mb-1">Entry</label>
                        <input type="date" className="w-full outline-none bg-transparent" />
                      </div>
                      <div className="p-2">
                        <label className="block font-bold uppercase mb-1">Exit</label>
                        <input type="date" className="w-full outline-none bg-transparent" />
                      </div>
                    </div>

                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95">
                      Reserve Spot
                    </button>
                    <p className="text-center text-sm text-gray-500">You won't be charged yet</p>
                  </div>
                </div>
              </div>
          </div>
        )}

        {view === ViewMode.HOST && (
          <div className="max-w-2xl mx-auto text-center space-y-8 py-12 animate-slide-up">
            <div className="bg-indigo-600 w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-white shadow-2xl rotate-3">
              <i className="fas fa-hand-holding-dollar text-4xl"></i>
            </div>
            <h2 className="text-4xl font-extrabold">ParkShare your space.</h2>
            <p className="text-xl text-gray-600">Earn up to $500/month by renting out your idle driveway, garage, or parking spot.</p>
            <div className="flex flex-col gap-4">
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform active:scale-95">
                Get Started
              </button>
              <button className="text-indigo-600 font-bold hover:underline">
                Learn how it works
              </button>
            </div>
          </div>
        )}
      </main>

      <AssistantDrawer />

      <footer className="mt-20 border-t border-gray-200 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 text-white p-1 rounded-md">
                <i className="fas fa-parking"></i>
              </div>
              <span className="text-lg font-bold">ParkShare</span>
            </div>
            <p className="text-gray-500 text-sm max-w-sm">Making urban parking easier, safer, and more affordable for everyone. Join the revolution in shared mobility.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="hover:text-indigo-600 cursor-pointer">About us</li>
              <li className="hover:text-indigo-600 cursor-pointer">Careers</li>
              <li className="hover:text-indigo-600 cursor-pointer">Blog</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="hover:text-indigo-600 cursor-pointer">Help Center</li>
              <li className="hover:text-indigo-600 cursor-pointer">Trust & Safety</li>
              <li className="hover:text-indigo-600 cursor-pointer">Contact</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-12 pt-12 mt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© 2024 ParkShare Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span className="hover:underline cursor-pointer">Terms</span>
            <span className="hover:underline cursor-pointer">Sitemap</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
