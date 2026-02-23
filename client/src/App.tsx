import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Menu, X } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { LocationSelector } from './components/LocationSelector/LocationSelector';
import { CategoryNav } from './components/CategoryNav/CategoryNav';
import { MenuGrid } from './components/MenuGrid/MenuGrid';
import { SearchBar } from './components/SearchBar/SearchBar';

const queryClient = new QueryClient();

function App() {
  const [locationId, setLocationId] = useState<string | null>(() =>
    localStorage.getItem('perDiemLocationId')
  );
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLocationSelect = (id: string) => {
    setLocationId(id);
    localStorage.setItem('perDiemLocationId', id);
    setActiveCategoryId(null);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
  };

  const handleCategorySelect = (id: string | null) => {
    setActiveCategoryId(id);
    if (id) {
      const el = document.getElementById(`category-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      document.getElementById('menu-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div 
          className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 font-sans transition-colors"
          onKeyDown={handleKeyDown}
        >

          {/* ── Mobile Overlay ──────────────────────────────────────────────── */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 z-40 md:hidden backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
              role="button"
              tabIndex={0}
              aria-label="Close menu"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setIsMobileMenuOpen(false);
                }
              }}
            />
          )}

          {/* ── Sidebar (Drawer) ────────────────────────────────────────────── */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 dark:bg-slate-950 border-r border-slate-800 dark:border-slate-700 flex flex-col transform transition-transform duration-300 ease-in-out shadow-2xl
              md:relative md:translate-x-0 md:w-64 md:shadow-none
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Brand */}
            <div className="px-6 py-5 border-b border-slate-800 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center shrink-0 shadow-sm" aria-hidden="true">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg tracking-tight leading-none">Per Diem</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-semibold mt-0.5">Enterprise Menu</p>
                </div>
              </div>
              {/* Close Button (Mobile) */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden text-slate-400 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close navigation menu"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Navigation content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6">
              {/* Location Section */}
              <div role="region" aria-label="Location selection">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <span className="w-1 h-1 rounded-full bg-blue-500" aria-hidden="true" />
                  <p className="text-slate-400 dark:text-slate-300 text-xs font-bold uppercase tracking-widest">Location</p>
                </div>
                <LocationSelector selectedLocationId={locationId} onSelect={handleLocationSelect} />
              </div>

              {/* Categories Section */}
              {locationId && (
                <div role="region" aria-label="Category navigation">
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <span className="w-1 h-1 rounded-full bg-blue-500" aria-hidden="true" />
                    <p className="text-slate-400 dark:text-slate-300 text-xs font-bold uppercase tracking-widest">Categories</p>
                  </div>
                  <CategoryNav locationId={locationId} activeCategoryId={activeCategoryId} onSelect={handleCategorySelect} />
                </div>
              )}
            </div>
          </aside>

          {/* ── Main Content Area ───────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900 relative transition-colors">

            {/* Topbar */}
            <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-4 shadow-sm shrink-0 h-[64px] transition-colors">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="navigation-menu"
              >
                <Menu size={22} aria-hidden="true" />
              </button>

              <div className="flex-1 flex items-center gap-3">
                {locationId ? (
                  <SearchBar value={searchQuery} onChange={setSearchQuery} />
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 animate-pulse" role="status" aria-live="polite">
                    <span className="text-lg" aria-hidden="true">←</span>
                    <span className="text-sm font-medium">Select a location to begin</span>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />
            </header>

            {/* Scrollable Canvas */}
            <main
              id="menu-scroll-container"
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 scroll-smooth"
              role="main"
              aria-label="Menu items"
            >
              <div className="max-w-full mx-auto">
                <MenuGrid locationId={locationId} activeCategoryId={activeCategoryId} searchQuery={searchQuery} />
              </div>
            </main>

          </div>

        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
