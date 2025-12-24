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

  // Auto-scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setView(ViewMode.LISTING_DETAIL);
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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar onNavigate={setView} currentView={view} />
      
      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-20 py-8">
        {view === ViewMode.HOME && (
          <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <section className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=2000" 
                className="absolute inset-0 w-full h-full object-cover"
                alt="Parking background"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center p-6">
                <div className="max-w-3xl text-center">
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg">
                    Find your car's home.
                  </h1>
                  <div className="bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2 max-w-2xl mx-auto">
                    <div className="flex-grow flex items-center gap-3 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100">
                      <i className="fas fa-map-marker-alt text-indigo-600"></i>
                      <input 
                        type="text" 
                        placeholder="Search for parking nearby..."
                        className="w-full bg-transparent outline-none text-gray-900 font-medium placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                      />
                    </div>
                    <button 
                      onClick={performSearch}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl md:rounded-full font-bold transition-all transform active:scale-95 shadow-lg shadow-indigo-200"
                    >
                      Find Spot
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Category Tags */}
            <div className="flex items-center gap-6 overflow-x-auto pb-4 no-scrollbar">
              {[
                { name: 'Underground', icon: 'fa-warehouse' },
                { name: 'EV Ready', icon: 'fa-bolt' },
                { name: 'Secured', icon: 'fa-shield-halved' },
                { name: 'Monthly', icon: 'fa-calendar' },
                { name: 'Valet', icon: 'fa-user-tie' },
                { name: 'Compact', icon: 'fa-car-side' }
              ].map(cat => (
                <button key={cat.name} className="flex-shrink-0 flex flex-col items-center gap-3 group">
                  <div className="w-12 h-12 flex items-center justify-center text-gray-500 group-hover:text-indigo-600 transition-colors">
                    <i className={`fas ${cat.icon} text-2xl`}></i>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 group-hover:text-gray-900 group-hover:border-b-2 border-gray-900 pb-1 transition-all">{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Main Listings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {MOCK_SPOTS.map(spot => (
                <ParkingCard key={spot.id} spot={spot} onClick={handleSpotClick} />
              ))}
            </div>
          </div>
        )}

        {view === ViewMode.SEARCH && (
          <div className="space-y-10 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView(ViewMode.HOME)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full border border-gray-200 transition-colors"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <h2 className="text-3xl font-bold tracking-tight">Spots in {searchQuery || 'your area'}</h2>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer hover:border-gray-900 transition-colors">
                <i className="fas fa-sliders-h"></i>
                <span>Filters</span>
              </div>
            </div>

            {/* AI Summary Section */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center gap-3 text-indigo-700 font-bold mb-4 text-lg">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                  <i className="fas fa-sparkles text-sm"></i>
                </div>
                Smart Area Insights
              </div>
              
              {loadingInsights ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-5 bg-indigo-200/50 rounded-full w-3/4"></div>
                  <div className="h-5 bg-indigo-200/50 rounded-full w-1/2"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed text-lg italic">
                    "{insights?.text || "Analyzing current market trends and security reports for the requested location..."}"
                  </p>
                  {insights?.sources && insights.sources.length > 0 && (
                    <div className="pt-6 border-t border-indigo-100">
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Grounding Sources</p>
                      <div className="flex flex-wrap gap-4">
                        {insights.sources.map((src, i) => (
                          <a 
                            key={i} 
                            href={src.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm transition-all hover:-translate-y-0.5"
                          >
                            <i className="fas fa-globe text-[12px]"></i> {src.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {MOCK_SPOTS.map(spot => (
                <ParkingCard key={spot.id} spot={spot} onClick={handleSpotClick} />
              ))}
            </div>
          </div>
        )}

        {view === ViewMode.LISTING_DETAIL && selectedSpot && (
          <div className="max-w-6xl mx-auto space-y-10 animate-slide-up">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setView(ViewMode.HOME)}
                  className="flex items-center gap-2 font-bold hover:text-indigo-600 transition-colors"
                >
                  <i className="fas fa-arrow-left"></i> All Listings
                </button>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                    <i className="fas fa-share-nodes"></i> <span className="underline">Share</span>
                  </button>
                  <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                    <i className="far fa-heart"></i> <span className="underline">Save</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-10">
                  <div className="rounded-3xl overflow-hidden shadow-2xl h-[500px]">
                    <img src={selectedSpot.image} className="w-full h-full object-cover" alt={selectedSpot.title} />
                  </div>
                  
                  <div className="space-y-8">
                    <div className="border-b border-gray-100 pb-8">
                      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">{selectedSpot.title}</h1>
                      <div className="flex flex-wrap items-center gap-6 text-gray-600 font-medium">
                        <span className="flex items-center gap-2">
                          <i className="fas fa-star text-indigo-600"></i> {selectedSpot.rating}
                        </span>
                        <span>{selectedSpot.reviews} reviews</span>
                        <span className="underline text-gray-900">{selectedSpot.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
                      <img src={selectedSpot.owner.avatar} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" alt={selectedSpot.owner.name} />
                      <div>
                        <p className="text-lg font-bold">Managed by {selectedSpot.owner.name}</p>
                        <p className="text-gray-500 text-sm">Verified Host • Fast responder</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold">Key Spot Features</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {selectedSpot.features.map(f => (
                          <div key={f} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-indigo-200 transition-colors">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                               <i className={`fas ${f === 'CCTV' ? 'fa-video' : f === 'Underground' ? 'fa-warehouse' : f === 'EV Charging' ? 'fa-plug-circle-bolt' : 'fa-check-circle'}`}></i>
                            </div>
                            <span className="font-semibold text-gray-700">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">About this space</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {selectedSpot.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="p-8 border border-gray-200 rounded-3xl shadow-2xl space-y-6 sticky top-28 bg-white overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-3xl font-extrabold text-gray-900">${selectedSpot.pricePerHour.toFixed(2)}<span className="text-lg font-medium text-gray-400">/hr</span></span>
                      <span className="flex items-center gap-1 text-sm font-bold">
                        <i className="fas fa-star text-xs text-indigo-600"></i> {selectedSpot.rating}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border border-gray-300 rounded-xl overflow-hidden">
                        <div className="grid grid-cols-2 border-b border-gray-300">
                          <div className="p-3 border-r border-gray-300">
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-tighter">Check-In</label>
                            <input type="time" className="w-full outline-none bg-transparent font-medium" defaultValue="09:00" />
                          </div>
                          <div className="p-3">
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-tighter">Check-Out</label>
                            <input type="time" className="w-full outline-none bg-transparent font-medium" defaultValue="18:00" />
                          </div>
                        </div>
                        <div className="p-3">
                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-tighter">Vehicle Type</label>
                          <select className="w-full outline-none bg-transparent font-medium">
                            <option>Sedan / SUV</option>
                            <option>Motorcycle</option>
                            <option>EV Only</option>
                            <option>Van / Large</option>
                          </select>
                        </div>
                      </div>

                      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 rounded-xl transition-all shadow-xl shadow-indigo-200 active:scale-95 text-lg">
                        Reserve Now
                      </button>
                    </div>

                    <div className="space-y-3 pt-4">
                      <div className="flex justify-between text-gray-600">
                        <span className="underline">$4.50 x 9 hours</span>
                        <span>$40.50</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="underline">Service fee</span>
                        <span>$2.00</span>
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex justify-between font-extrabold text-xl text-gray-900">
                        <span>Total</span>
                        <span>$42.50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        )}

        {view === ViewMode.HOST && (
          <div className="max-w-4xl mx-auto py-12 animate-slide-up text-center">
            <div className="relative inline-block mb-10">
              <div className="absolute -inset-4 bg-indigo-600/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-indigo-50">
                <i className="fas fa-hand-holding-dollar text-6xl text-indigo-600"></i>
              </div>
            </div>
            <h2 className="text-5xl font-extrabold tracking-tight mb-6">List your parking spot.</h2>
            <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of hosts earning extra income from their driveways, garages, and carports.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { title: 'Set your price', desc: 'Choose your hourly or monthly rates.', icon: 'fa-tags' },
                { title: 'Stay flexible', desc: 'Host whenever you want with ease.', icon: 'fa-calendar-check' },
                { title: 'Get paid safe', desc: 'Secure payouts direct to your bank.', icon: 'fa-shield-check' }
              ].map(item => (
                <div key={item.title} className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <i className={`fas ${item.icon} text-xl`}></i>
                  </div>
                  <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-2xl font-extrabold text-xl transition-all shadow-2xl shadow-indigo-100 transform hover:scale-105 active:scale-95">
              Start Hosting Today
            </button>
          </div>
        )}
      </main>

      <AssistantDrawer />

      <footer className="bg-gray-50 border-t border-gray-200 py-16 mt-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 text-white p-2 rounded-xl">
                  <i className="fas fa-parking text-2xl"></i>
                </div>
                <span className="text-2xl font-black tracking-tighter">ParkShare</span>
              </div>
              <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
                Revolutionizing urban parking through community-driven sharing. Find a spot, share a spot, and reclaim your time.
              </p>
              <div className="flex gap-4">
                {['facebook', 'twitter', 'instagram'].map(s => (
                  <a key={s} href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                    <i className={`fab fa-${s}`}></i>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Support</h4>
              <ul className="space-y-4 text-gray-600 font-medium">
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">AirCover</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Anti-discrimination</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Disability support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Hosting</h4>
              <ul className="space-y-4 text-gray-600 font-medium">
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">ParkShare your space</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Hosting resources</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Community forum</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Hosting responsibly</li>
              </ul>
            </div>
            <div className="col-span-2">
              <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Newsletter</h4>
              <p className="text-gray-500 mb-4 font-medium">Join our community for weekly parking hacks and top local spots.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email address" className="bg-white border border-gray-300 rounded-xl px-4 py-3 flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors">Join</button>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-semibold text-gray-500">
            <div className="flex gap-6 flex-wrap justify-center">
              <span>© 2024 ParkShare Inc.</span>
              <span className="hover:underline cursor-pointer">Privacy</span>
              <span className="hover:underline cursor-pointer">Terms</span>
              <span className="hover:underline cursor-pointer">Sitemap</span>
              <span className="hover:underline cursor-pointer">Company details</span>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 hover:underline cursor-pointer"><i className="fas fa-globe"></i> English (US)</span>
              <span className="flex items-center gap-2 hover:underline cursor-pointer">$ USD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;