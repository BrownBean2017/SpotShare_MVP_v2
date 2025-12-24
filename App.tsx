import React, { useState, useEffect } from 'react';
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

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setView(ViewMode.LISTING_DETAIL);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoadingInsights(true);
    setView(ViewMode.SEARCH);
    
    try {
      const result = await getParkingInsights(searchQuery);
      setInsights(result);
    } catch (err) {
      setInsights({ text: "Showing available spots in your area.", sources: [] });
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={setView} currentView={view} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === ViewMode.HOME && (
          <div className="space-y-12">
            {/* Simple Hero */}
            <section className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-indigo-900 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=2400" 
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                alt="Parking"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Find Your Next Spot</h1>
                <form onSubmit={handleSearch} className="w-full max-w-2xl bg-white rounded-full p-2 flex items-center shadow-2xl">
                  <input 
                    type="text" 
                    placeholder="Where are you going?"
                    className="flex-1 px-6 py-3 text-gray-900 outline-none rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors">
                    Search
                  </button>
                </form>
              </div>
            </section>

            {/* Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured parking spots</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {MOCK_SPOTS.map(spot => (
                  <ParkingCard key={spot.id} spot={spot} onClick={handleSpotClick} />
                ))}
              </div>
            </div>
          </div>
        )}

        {view === ViewMode.SEARCH && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4">
              <button onClick={() => setView(ViewMode.HOME)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <i className="fas fa-arrow-left"></i>
              </button>
              <h2 className="text-3xl font-bold">Results for "{searchQuery}"</h2>
            </div>

            {/* AI Insights Card */}
            <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
              <div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold">
                <i className="fas fa-sparkles"></i>
                <span>ParkShare AI Insight</span>
              </div>
              {loadingInsights ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-indigo-200/50 rounded w-3/4"></div>
                  <div className="h-4 bg-indigo-200/50 rounded w-1/2"></div>
                </div>
              ) : (
                <p className="text-indigo-900 font-medium">{insights?.text || "No specific local data available. Here are some options."}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {MOCK_SPOTS.map(spot => (
                <ParkingCard key={spot.id} spot={spot} onClick={handleSpotClick} />
              ))}
            </div>
          </div>
        )}

        {view === ViewMode.LISTING_DETAIL && selectedSpot && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <button onClick={() => setView(ViewMode.HOME)} className="font-bold text-gray-500 hover:text-gray-900">
              <i className="fas fa-chevron-left mr-2"></i> Back
            </button>
            
            <div className="aspect-video rounded-3xl overflow-hidden shadow-lg">
              <img src={selectedSpot.image} className="w-full h-full object-cover" alt={selectedSpot.title} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-6">
                <h1 className="text-4xl font-extrabold text-gray-900">{selectedSpot.title}</h1>
                <div className="flex items-center gap-4 text-gray-600 font-semibold border-b pb-6">
                  <span className="text-indigo-600"><i className="fas fa-star"></i> {selectedSpot.rating}</span>
                  <span>{selectedSpot.reviews} reviews</span>
                  <span>{selectedSpot.location}</span>
                </div>
                
                <div className="flex items-center gap-4 py-4">
                  <img src={selectedSpot.owner.avatar} className="w-12 h-12 rounded-full object-cover" alt="host" />
                  <div>
                    <p className="font-bold text-lg">Hosted by {selectedSpot.owner.name}</p>
                    <p className="text-gray-500 text-sm">Member since 2023</p>
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed">{selectedSpot.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {selectedSpot.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-gray-700 font-medium">
                      <i className="fas fa-check text-green-500"></i> {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 border rounded-3xl shadow-lg sticky top-24">
                  <div className="text-2xl font-extrabold mb-4">${selectedSpot.pricePerHour.toFixed(2)} <span className="text-sm font-normal text-gray-500">/ hour</span></div>
                  <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                    Reserve Space
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4 italic">Free cancellation up to 24h before arrival</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === ViewMode.HOST && (
          <div className="max-w-3xl mx-auto py-16 text-center space-y-8 animate-fade-in">
            <h2 className="text-5xl font-extrabold text-gray-900">Your space is worth <span className="text-indigo-600">money.</span></h2>
            <p className="text-xl text-gray-500">List your driveway, garage, or open lot in under 5 minutes.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left py-8">
              <div className="p-6 bg-gray-50 rounded-2xl">
                <i className="fas fa-shield-alt text-2xl text-indigo-600 mb-4"></i>
                <h4 className="font-bold mb-2">Secure</h4>
                <p className="text-sm text-gray-600">ID verification and covered by ParkShare insurance.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl">
                <i className="fas fa-clock text-2xl text-indigo-600 mb-4"></i>
                <h4 className="font-bold mb-2">Flexible</h4>
                <p className="text-sm text-gray-600">Set your own availability and hourly rates.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl">
                <i className="fas fa-wallet text-2xl text-indigo-600 mb-4"></i>
                <h4 className="font-bold mb-2">Fast Payout</h4>
                <p className="text-sm text-gray-600">Funds transferred directly to your bank weekly.</p>
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
              List Your Spot
            </button>
          </div>
        )}
      </main>

      <AssistantDrawer />
    </div>
  );
};

export default App;