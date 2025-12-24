import React, { useState, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const handleSpotClick = useCallback((spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setView(ViewMode.LISTING_DETAIL);
  }, []);

  const performSearch = async () => {
    const query = searchQuery.trim();
    if (!query) return;
    
    setLoadingInsights(true);
    setView(ViewMode.SEARCH);
    
    try {
      const result = await getParkingInsights(query);
      setInsights(result);
    } catch (err) {
      console.error("Search error:", err);
      setInsights({ text: "I couldn't find specific trends for this area, but here are some available spots.", sources: [] });
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSearchQuery(category);
    performSearch();
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={setView} currentView={view} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === ViewMode.HOME && (
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative h-[600px] rounded-[2.5rem] overflow-hidden group shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1545179605-1296651e9d43?auto=format&fit=crop&q=80&w=2400" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt="Modern Garage"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight drop-shadow-2xl animate-in">
                  Parking, <span className="text-indigo-400">Simplified.</span>
                </h1>
                
                <div className="bg-white/95 backdrop-blur-md p-2 rounded-3xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full max-w-3xl animate-in" style={{ animationDelay: '0.1s' }}>
                  <div className="flex-grow flex items-center gap-3 px-6 py-4">
                    <i className="fas fa-search text-gray-400"></i>
                    <input 
                      type="text" 
                      placeholder="Where do you want to park?"
                      className="w-full bg-transparent outline-none text-gray-900 font-medium placeholder:text-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                    />
                  </div>
                  <button 
                    onClick={performSearch}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl md:rounded-full font-bold transition-all transform hover:scale-105 active:scale-95"
                  >
                    Search
                  </button>
                </div>
              </div>
            </section>

            {/* Categories */}
            <div className="flex items-center justify-center gap-8 overflow-x-auto pb-4 no-scrollbar animate-in" style={{ animationDelay: '0.2s' }}>
              {[
                { name: 'Underground', icon: 'fa-warehouse' },
                { name: 'EV Ready', icon: 'fa-bolt' },
                { name: '24/7 Access', icon: 'fa-clock' },
                { name: 'Monthly', icon: 'fa-calendar-check' },
                { name: 'Large Spots', icon: 'fa-truck' },
                { name: 'Security', icon: 'fa-shield-check' }
              ].map(cat => (
                <button 
                  key={cat.name} 
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex-shrink-0 flex flex-col items-center gap-3 group transition-all"
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all border border-transparent group-hover:border-indigo-100">
                    <i className={`fas ${cat.icon} text-2xl`}></i>
                  </div>
                  <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900">{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Featured Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in" style={{ animationDelay: '0.3s' }}>
              {MOCK_SPOTS.map(spot => (
                <ParkingCard key={spot.id} spot={spot} onClick={handleSpotClick} />
              ))}
            </div>
          </div>
        )}

        {view === ViewMode.SEARCH && (
          <div className="space-y-12 animate-in">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <button onClick={() => setView(ViewMode.HOME)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <i className="fas fa-arrow-left text-xl"></i>
                </button>
                <h2 className="text-4xl font-extrabold tracking-tight">Spots in {searchQuery || 'Your Area'}</h2>
              </div>

              {/* Smart Insight Panel */}
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                      <i className="fas fa-wand-magic-sparkles"></i>
                    </div>
                    <span className="font-bold text-lg">ParkShare AI Intelligence</span>
                  </div>
                  
                  {loadingInsights ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-4 bg-white/20 rounded w-3/4"></div>
                      <div className="h-4 bg-white/20 rounded w-1/2"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-xl font-medium leading-relaxed opacity-95">
                        {insights?.text || "Analyzing current parking trends for this neighborhood..."}
                      </p>
                      {insights?.sources && insights.sources.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {insights.sources.map((src, i) => (
                            <a 
                              key={i} 
                              href={src.uri} 
                              target="_blank" 
                              rel="noopener" 
                              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all"
                            >
                              <i className="fas fa-external-link-alt mr-2"></i> {src.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {MOCK_SPOTS.map(spot => (
                <ParkingCard key={spot.id} spot={spot} onClick={handleSpotClick} />
              ))}
            </div>
          </div>
        )}

        {view === ViewMode.LISTING_DETAIL && selectedSpot && (
          <div className="max-w-6xl mx-auto animate-in">
            <button 
              onClick={() => setView(ViewMode.HOME)}
              className="mb-8 flex items-center gap-2 font-bold text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <i className="fas fa-arrow-left"></i> Back to explore
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <img src={selectedSpot.image} className="w-full h-full object-cover" alt={selectedSpot.title} />
                </div>
                
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-6">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tighter">{selectedSpot.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-gray-600 font-semibold">
                      <span className="flex items-center gap-2 text-indigo-600">
                        <i className="fas fa-star"></i> {selectedSpot.rating}
                      </span>
                      <span>•</span>
                      <span>{selectedSpot.reviews} reviews</span>
                      <span>•</span>
                      <span className="underline cursor-pointer hover:text-indigo-600">{selectedSpot.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <img src={selectedSpot.owner.avatar} className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-sm" alt={selectedSpot.owner.name} />
                      <div>
                        <p className="text-xl font-bold">Hosted by {selectedSpot.owner.name}</p>
                        <p className="text-gray-500 font-medium">Verified Professional Host</p>
                      </div>
                    </div>
                    <button className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-2xl border border-gray-200 hover:bg-indigo-50 transition-colors">
                      Contact Host
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Space Description</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {selectedSpot.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {selectedSpot.features.map(f => (
                      <div key={f} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                          <i className="fas fa-check"></i>
                        </div>
                        <span className="font-bold text-gray-700">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-4">
                <div className="sticky top-32 p-8 border border-gray-100 rounded-[2.5rem] shadow-2xl bg-white space-y-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">${selectedSpot.pricePerHour.toFixed(2)}<span className="text-lg font-medium text-gray-400">/hr</span></span>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Top Rated</span>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50 space-y-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date & Time</p>
                      <p className="font-bold">Select access period</p>
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 transform hover:scale-[1.02] active:scale-95 text-lg">
                      Reserve Spot
                    </button>
                    <p className="text-center text-gray-400 text-xs font-medium">No charge yet. Cancellation is free within 24h.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === ViewMode.HOST && (
          <div className="max-w-4xl mx-auto py-20 text-center space-y-12 animate-in">
            <div className="space-y-4">
              <h2 className="text-6xl font-extrabold tracking-tighter">Turn your driveway into <span className="text-indigo-600">passive income.</span></h2>
              <p className="text-2xl text-gray-500 max-w-2xl mx-auto font-medium">
                Over 50,000 people are already renting out their idle parking spaces.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8 text-left">
              {[
                { title: 'Safe', desc: 'Secure payments & identity verification.', icon: 'fa-shield-heart' },
                { title: 'Flexible', desc: 'Set your own hours & pricing.', icon: 'fa-sliders' },
                { title: 'Easy', desc: 'List in under 5 minutes.', icon: 'fa-bolt' }
              ].map(feat => (
                <div key={feat.title} className="p-8 bg-gray-50 rounded-[2rem] space-y-4">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                    <i className={`fas ${feat.icon} text-xl`}></i>
                  </div>
                  <h4 className="text-xl font-bold">{feat.title}</h4>
                  <p className="text-gray-500 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              ))}
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-16 py-6 rounded-3xl font-extrabold text-xl transition-all shadow-2xl shadow-indigo-200 transform hover:scale-105 active:scale-95 inline-block">
              Start Hosting Today
            </button>
          </div>
        )}
      </main>

      <AssistantDrawer />
    </div>
  );
};

export default App;