import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Globe, 
  Zap, 
  BarChart3, 
  Settings, 
  Activity, 
  Database, 
  Lock,
  ChevronRight,
  ExternalLink,
  Wifi,
  Server,
  Terminal,
  Menu,
  Bell,
  Map,
  Fingerprint,
  MapPin,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom types for stats
interface Stats {
  adsBlocked: number;
  dataSaved: string;
  threatsPrevented: number;
  connectedTime: string;
}

export default function App() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isTorActive, setIsTorActive] = useState<boolean>(true);
  const [isDohEnabled, setIsDohEnabled] = useState<boolean>(true);
  const [isKernelFilterActive, setIsKernelFilterActive] = useState<boolean>(true);
  const [isGlobalDnsActive, setIsGlobalDnsActive] = useState<boolean>(true);
  const [isAnonymousMode, setIsAnonymousMode] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'logs' | 'settings' | 'identity'>('home');
  const [secondsConnected, setSecondsConnected] = useState<number>(0);
  
  const [sourceIp, setSourceIp] = useState<string>("192.168.1." + Math.floor(Math.random() * 255));
  const [virtualIp, setVirtualIp] = useState<string>("104.22.41." + Math.floor(Math.random() * 255));
  
  // Circuit nodes with coordinates for mapping
  const [circuitNodes, setCircuitNodes] = useState<{name: string, ip: string, country: string, coord: {x: number, y: number}}[]>([
    { name: "Entry Guard", ip: "78.47.124.6", country: "Germany", coord: { x: 52, y: 15 } },
    { name: "Middle Relay", ip: "185.100.84.152", country: "Sweden", coord: { x: 55, y: 10 } }
  ]);

  const nodes = [
    { id: 'zhr', name: "Zurich, CH", latency: "24ms", load: "12%", flag: "🇨🇭", status: "Optimal", coord: { x: 50, y: 22 } },
    { id: 'fra', name: "Frankfurt, DE", latency: "38ms", load: "45%", flag: "🇩🇪", status: "Busy", coord: { x: 52, y: 18 } },
    { id: 'bom', name: "Mumbai, IN", latency: "12ms", load: "8%", flag: "🇮🇳", status: "Optimal", coord: { x: 68, y: 32 } },
    { id: 'sin', name: "Singapore, SG", latency: "65ms", load: "22%", flag: "🇸🇬", status: "Good", coord: { x: 78, y: 40 } },
    { id: 'nyc', name: "New York, US", latency: "110ms", load: "60%", flag: "🇺🇸", status: "High Latency", coord: { x: 28, y: 22 } },
  ];

  const [selectedNode, setSelectedNode] = useState(nodes[0]);
  
  const [lastBlocked, setLastBlocked] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([
    "System initialized.",
    "DNS Filtering ready.",
    "Awaiting connection..."
  ]);
  
  const [stats, setStats] = useState<Stats>({
    adsBlocked: 1429,
    dataSaved: "28.4 MB",
    threatsPrevented: 42,
    connectedTime: "00:00:00"
  });

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsConnected(prev => prev + 1);
      }, 1000);
    } else {
      setSecondsConnected(0);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Format time
  useEffect(() => {
    const hours = Math.floor(secondsConnected / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((secondsConnected % 3600) / 60).toString().padStart(2, '0');
    const seconds = (secondsConnected % 60).toString().padStart(2, '0');
    setStats(prev => ({ ...prev, connectedTime: `${hours}:${minutes}:${seconds}` }));
  }, [secondsConnected]);

  // Simulate stats increment when active
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        const sites = [
          "doubleclick.net", 
          "google-analytics.com", 
          "facebook.com/tr", 
          "ads.twitter.com",
          "adservice.google.com",
          "telemetry.microsoft.com",
          "track.apps.io"
        ];
        
        const apps = [
          "Instagram",
          "YouTube App",
          "Candy Crush",
          "Truecaller",
          "System Settings",
          "Mi Browser",
          "Facebook App"
        ];
        
        if (Math.random() > 0.6) {
          const isApp = Math.random() > 0.5;
          const site = sites[Math.floor(Math.random() * sites.length)];
          const app = apps[Math.floor(Math.random() * apps.length)];
          
          setStats(prev => ({
            ...prev,
            adsBlocked: prev.adsBlocked + 1,
            dataSaved: (parseFloat(prev.dataSaved) + 0.1).toFixed(1) + " MB"
          }));
          
          const logMsg = isApp 
            ? `[SYSTEM] ${app} ad request to ${site} BLOCKED.`
            : `[NETWORK] Browser request to ${site} intercepted.`;
            
          setLastBlocked(isApp ? `${app} Ad` : site);
          setLogs(prev => [logMsg, ...prev.slice(0, 49)]);
          
          // Clear notification after 2 seconds
          setTimeout(() => setLastBlocked(null), 2000);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleVpn = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setLogs(prev => ["VPN connection established. Tunneling traffic...", ...prev]);
    } else {
      setLogs(prev => ["VPN disconnected. Protection paused.", ...prev]);
    }
  };

  const generateNewIdentity = () => {
    const newIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const countries = ["Germany", "Sweden", "Netherlands", "Canada", "Finland", "Japan", "Brazil", "Australia"];
    const ips = ["192.168.0.1", "172.16.0.1", "10.0.0.1", "45.12.33.1", "88.22.11.5"];
    
    // Pick a random node that is different from current if possible
    const otherNodes = nodes.filter(n => n.id !== selectedNode.id);
    const randomNode = otherNodes.length > 0 
      ? otherNodes[Math.floor(Math.random() * otherNodes.length)]
      : nodes[Math.floor(Math.random() * nodes.length)];
      
    setSelectedNode(randomNode);
    const entryCoord = { x: 45 + Math.random() * 10, y: 10 + Math.random() * 10 };
    const middleCoord = { x: 50 + Math.random() * 15, y: 20 + Math.random() * 10 };

    setVirtualIp(newIp);
    setCircuitNodes([
      { 
        name: "Entry Guard", 
        ip: ips[Math.floor(Math.random() * ips.length)], 
        country: countries[Math.floor(Math.random() * countries.length)],
        coord: entryCoord
      },
      { 
        name: "Middle Relay", 
        ip: ips[Math.floor(Math.random() * ips.length)], 
        country: countries[Math.floor(Math.random() * countries.length)],
        coord: middleCoord
      }
    ]);
    
    setLogs(prev => [`[SECURE] Identity rotated. New Node: ${randomNode.name}. New Virtual IP: ${newIp}`, ...prev.slice(0, 49)]);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar Navigation - Hidden on mobile, visible on medium screens and up */}
      <aside className="hidden md:flex w-64 lg:w-72 border-r border-slate-800 bg-slate-900/50 flex-col shrink-0">
        <div className="p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ShieldNet</h1>
          </div>
          
          <nav className="space-y-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 text-[10px]">Main Menu</div>
            <ul className="space-y-1">
              <li 
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeTab === 'home' ? 'bg-indigo-600/20 text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}`}
              >
                <Globe size={18} />
                <span>Dashboard</span>
              </li>
              <li 
                onClick={() => setActiveTab('identity')}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeTab === 'identity' ? 'bg-indigo-600/20 text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}`}
              >
                <Fingerprint size={18} />
                <span>Identity</span>
              </li>
              <li 
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeTab === 'stats' ? 'bg-indigo-600/20 text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}`}
              >
                <Server size={18} />
                <span>Network Nodes</span>
              </li>
              <li 
                onClick={() => setActiveTab('logs')}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeTab === 'logs' ? 'bg-indigo-600/20 text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}`}
              >
                <Terminal size={18} />
                <span>Shield Logs</span>
              </li>
              <li 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeTab === 'settings' ? 'bg-indigo-600/20 text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}`}
              >
                <Settings size={18} />
                <span>Management</span>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800 bg-slate-950/30 space-y-4">
          <a 
            href="https://nitin-8268.github.io/codexx" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl transition-all text-indigo-400 hover:bg-white/5 border border-indigo-500/20 group text-xs font-bold"
          >
            <ExternalLink size={14} className="group-hover:rotate-12 transition-transform" />
            <span>Connect Developer</span>
          </a>
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 mb-2">
              <span className={`w-2 h-2 rounded-full bg-emerald-500 ${isActive ? 'animate-pulse' : 'opacity-50'}`}></span>
              {isActive ? 'System Secure' : 'System Paused'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">v1.4.2 Stable</div>
          </div>
        </div>
      </aside>

      {/* Mobile Header / Nav - Visible only on mobile */}
      <header className="md:hidden h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shadow-lg z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight">ShieldNet</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-400 active:text-indigo-400"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Sidebar - Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            
            {/* Drawer Content */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-slate-900 border-r border-slate-800 z-[70] md:hidden flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold tracking-tight">ShieldNet</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-white">
                  <Menu size={20} className="rotate-90" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3">System Navigation</div>
                <nav className="space-y-1">
                  {[
                    { id: 'home', name: 'Dashboard', icon: Globe },
                    { id: 'identity', name: 'WhoIS Identity', icon: Fingerprint },
                    { id: 'stats', name: 'Network Nodes', icon: Server },
                    { id: 'logs', name: 'Shield Logs', icon: Terminal },
                    { id: 'settings', name: 'Management', icon: Settings },
                  ].map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-95 ${
                        activeTab === item.id 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-bold' 
                          : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </nav>
              </div>

              <div className="mt-auto space-y-4 pt-6 border-t border-slate-800">
                <a 
                  href="https://nitin-8268.github.io/codexx" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all text-indigo-400 hover:bg-indigo-500/10 active:scale-95 border border-indigo-500/20 group"
                >
                  <ExternalLink size={20} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-sm font-bold">Connect Developer</span>
                </a>
                <div className="bg-slate-950/50 rounded-2xl p-4 flex items-center justify-between border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold">NK</div>
                    <div className="text-[10px] space-y-0.5">
                      <p className="font-bold text-slate-200">Admin User</p>
                      <p className="text-slate-500">Premium Core</p>
                    </div>
                  </div>
                  <Share2 size={14} className="text-slate-500" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Ad Block Toast Notification */}
        <AnimatePresence>
          {lastBlocked && (
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-rose-500/90 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl backdrop-blur-md"
            >
              <ShieldAlert size={14} />
              Blocked: {lastBlocked}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header Bar - Desktop only */}
        <header className="hidden md:flex h-20 border-b border-slate-800 items-center justify-between px-6 lg:px-10 bg-slate-950/80 backdrop-blur shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-xs lg:text-sm text-slate-400">Platform: <span className="text-slate-100 font-mono bg-slate-800 px-2 py-1 rounded text-[10px] lg:text-xs uppercase">Multi-Platform</span></div>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="text-xs lg:text-sm text-slate-400">Layer: <span className={`font-mono px-2 py-1 rounded text-[10px] lg:text-xs uppercase font-bold ${isAnonymousMode ? 'text-indigo-400 bg-indigo-500/10' : 'text-rose-500 bg-rose-500/10'}`}>{isAnonymousMode ? 'ANONYMOUS' : 'EXPOSED'}</span></div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold">US</div>
              <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold">IN</div>
              <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold">DE</div>
            </div>
            <button 
              onClick={() => window.open('https://github.com/shieldnet/shield-core', '_blank')}
              className="px-4 lg:px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs lg:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <Share2 size={14} />
              Source
            </button>
          </div>
        </header>

        {/* Content View */}
        <div className="p-4 pb-32 md:p-6 md:pb-6 lg:p-10 flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto"
              >
                <div className="flex-1 space-y-6 md:space-y-8">
                  {/* Status Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 tracking-tight">Privacy Shield {isActive ? 'Active' : 'Standby'}</h2>
                          <div className="flex gap-2 mb-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all ${isKernelFilterActive && isActive ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>Kernel Hooked</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all ${isGlobalDnsActive && isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>System DNS</span>
                          </div>
                          <p className="text-slate-400 max-w-md leading-relaxed text-xs md:text-sm">
                            System-wide protection active. All device applications are being filtered and tunneled through the secure network core.
                          </p>
                        </div>
                        
                        <div 
                          onClick={toggleVpn}
                          className={`w-16 h-8 md:w-20 md:h-10 rounded-full cursor-pointer transition-all duration-500 p-1 flex items-center ${isActive ? 'bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-slate-800/50 border border-slate-700'}`}
                        >
                          <motion.div 
                            animate={{ x: isActive ? 40 : 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className={`w-6 h-6 md:w-8 md:h-8 rounded-full transition-all shadow-lg ${isActive ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-slate-500'}`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
                        <div className="bg-slate-950/40 p-4 md:p-5 rounded-2xl border border-slate-800/50 backdrop-blur-sm group hover:border-indigo-500/30 transition-colors">
                          <div className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1 md:mb-2 flex items-center gap-2">
                             <Zap size={10} className="text-indigo-400" />
                             Ads Blocked
                          </div>
                          <div className="text-2xl md:text-3xl font-mono text-indigo-400 font-bold">{stats.adsBlocked.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-950/40 p-4 md:p-5 rounded-2xl border border-slate-800/50 backdrop-blur-sm group hover:border-emerald-500/30 transition-colors">
                          <div className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1 md:mb-2 flex items-center gap-2">
                             <Database size={10} className="text-emerald-400" />
                             Data Saved
                          </div>
                          <div className="text-2xl md:text-3xl font-mono text-emerald-400 font-bold tracking-tighter">{stats.dataSaved}</div>
                        </div>
                        <div className="bg-slate-950/40 p-4 md:p-5 rounded-2xl border border-slate-800/50 backdrop-blur-sm group hover:border-slate-500/30 transition-colors">
                          <div className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1 md:mb-2 flex items-center gap-2">
                             <Server size={10} className="text-slate-400" />
                             Connected Node
                          </div>
                          <div className="text-2xl md:text-3xl font-mono text-slate-100 font-bold flex items-center gap-3">
                            {selectedNode.flag} {selectedNode.id.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]"></div>
                  </div>

                  {/* Activity Preview */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-base md:text-lg font-bold">Recent Traffic</h3>
                      </div>
                      <button onClick={() => setActiveTab('logs')} className="text-[10px] text-indigo-400 uppercase font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-2 md:space-y-3 font-mono text-[10px] md:text-[11px] text-slate-400 overflow-hidden h-32">
                      {logs.slice(0, 4).map((log, i) => (
                        <div key={i} className="flex items-center gap-2 md:gap-3 bg-slate-950/30 p-2 md:p-3 rounded-xl border border-slate-800/50">
                          <div className={`w-2 h-2 rounded-full ${log.includes('BLOCKED') ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          <span className="text-slate-300 truncate text-[10px] md:text-xs">{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Side Controls */}
                <div className="w-full xl:w-80 space-y-4 md:space-y-6 shrink-0 pb-20 md:pb-0">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h4 className="text-xs md:text-sm font-bold mb-4 md:mb-6 flex items-center gap-2 uppercase tracking-wide">
                      <Activity className="w-4 h-4 text-indigo-400" />
                      System Integrity
                    </h4>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-[10px] mb-2 font-bold opacity-60">
                          <span>THREAT PROTECTION</span>
                          <span className="text-emerald-400">{stats.threatsPrevented} BLOCKED</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-emerald-500/50"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-2 font-bold opacity-60">
                          <span>ENCRYPTION LAYER</span>
                          <span className="text-indigo-400 uppercase">AES-256</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-indigo-500/50"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6">
                    <h4 className="text-xs md:text-sm font-bold text-indigo-300 mb-4 uppercase tracking-wider">Features</h4>
                    <ul className="text-[10px] md:text-[11px] space-y-3">
                      <li className="flex items-center gap-3 text-indigo-200">
                        <Lock size={12} className="text-indigo-400" />
                        No-Log Architecture
                      </li>
                      <li className="flex items-center gap-3 text-indigo-200">
                        <Zap size={12} className="text-indigo-400" />
                        DNS-over-HTTPS (DoH)
                      </li>
                      <li className="flex items-center gap-3 text-indigo-200">
                        <Globe size={12} className="text-indigo-400" />
                        Tor Bridge Relay
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'identity' && (
              <motion.div 
                key="identity"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`max-w-6xl mx-auto space-y-6 flex flex-col min-h-full transition-all duration-700 ${!isAnonymousMode ? 'grayscale-[0.8] opacity-60' : ''}`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className={`text-3xl font-bold tracking-tight transition-colors ${!isAnonymousMode ? 'text-rose-500' : 'text-slate-100'}`}>
                      {isAnonymousMode ? 'Identity Shift' : 'Identity Exposed'}
                    </h2>
                    <p className="text-slate-500 text-sm">
                      {isAnonymousMode 
                        ? 'Visualizing your encrypted path through the global network' 
                        : 'Warning: We aren\'t Anonymous and anyone can see your original digital footprint'
                      }
                    </p>
                  </div>
                  <div 
                    onClick={() => {
                      setIsAnonymousMode(!isAnonymousMode);
                      setLogs(prev => [`[MODE] Anonymous shift: ${!isAnonymousMode ? 'SECURED' : 'EXPOSED'}`, ...prev.slice(0, 49)]);
                    }}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl border cursor-pointer transition-all duration-500 shadow-xl group active:scale-95 ${
                      isAnonymousMode 
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-indigo-500/20' 
                        : 'bg-rose-600/10 border-rose-500 shadow-rose-500/10'
                    }`}
                  >
                    <Fingerprint className={`w-5 h-5 transition-transform group-hover:scale-110 ${isAnonymousMode ? 'text-indigo-400' : 'text-rose-500'}`} />
                    <div className="text-left">
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 ${isAnonymousMode ? 'text-indigo-400' : 'text-rose-500'}`}>Security Layer</p>
                      <p className="text-sm font-bold uppercase transition-all">{isAnonymousMode ? 'Anonymous' : 'Exposed'}</p>
                    </div>
                    <div className={`ml-2 w-3 h-3 rounded-full animate-pulse ${isAnonymousMode ? 'bg-indigo-400 shadow-[0_0_8px_#6366f1]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`}></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Map Visualization */}
                  <div className={`lg:col-span-2 bg-slate-900 border rounded-3xl p-6 relative overflow-hidden h-[450px] shadow-2xl transition-all duration-500 ${
                    isAnonymousMode ? 'border-slate-800' : 'border-rose-500/30'
                  }`}>
                    {!isAnonymousMode && (
                      <div className="absolute inset-0 bg-rose-500/5 z-10 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-slate-950/80 border border-rose-500 p-6 rounded-2xl max-w-xs text-center shadow-2xl">
                          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-bounce" />
                          <h4 className="text-lg font-bold text-rose-500 mb-2">Tracking Prevented</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">Identity features are disabled in Exposed mode. Switch to Anonymous to see live data packets and network routing.</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    
                    {/* Simplified World Map SVG */}
                    <svg viewBox="0 0 100 60" className={`w-full h-full transition-all duration-1000 ${isAnonymousMode ? 'text-slate-800' : 'text-rose-900/40'}`}>
                      {/* Grid Lines */}
                      <g className="stroke-slate-800/20 stroke-[0.1]">
                        {[...Array(10)].map((_, i) => (
                          <line key={`v-${i}`} x1={i * 10} y1="0" x2={i * 10} y2="60" />
                        ))}
                        {[...Array(6)].map((_, i) => (
                          <line key={`h-${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} />
                        ))}
                      </g>

                      {/* Continents - simplified outlines for a tech/global feel */}
                      <path d="M10,12 Q18,8 28,15 T35,30 Q25,35 15,35 Z" fill="currentColor" fillOpacity="0.2" /> {/* North America */}
                      <path d="M22,38 Q32,38 32,55 T20,55 Z" fill="currentColor" fillOpacity="0.2" /> {/* South America */}
                      <path d="M42,12 Q65,5 82,12 T88,35 Q78,45 42,35 Z" fill="currentColor" fillOpacity="0.2" /> {/* Eurasia */}
                      <path d="M48,36 Q60,36 60,55 T45,55 Z" fill="currentColor" fillOpacity="0.2" /> {/* Africa */}
                      <path d="M78,42 Q88,42 92,55 T75,55 Z" fill="currentColor" fillOpacity="0.2" /> {/* Australia/Oceania */}
                      <path d="M68,18 Q72,15 75,20 T70,25 Z" fill="currentColor" fillOpacity="0.2" /> {/* SE Asia */}
                      
                      {/* Interaction Lines */}
                      {isActive && isAnonymousMode && (
                        <g key={selectedNode.id}>
                          {/* Segment 1: Origin to Entry Guard (Orange) */}
                          <motion.path 
                            d={`M 22 24 Q 30 15, ${circuitNodes[0].coord.x} ${circuitNodes[0].coord.y}`}
                            fill="none" 
                            stroke="#f97316" 
                            strokeWidth="0.8"
                            strokeLinecap="round"
                            strokeDasharray="2 2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1 }}
                          />
                          
                          {/* Segment 2: Entry to Middle (Amber) */}
                          <motion.path 
                            d={`M ${circuitNodes[0].coord.x} ${circuitNodes[0].coord.y} Q 50 10, ${circuitNodes[1].coord.x} ${circuitNodes[1].coord.y}`}
                            fill="none" 
                            stroke="#f59e0b" 
                            strokeWidth="0.8"
                            strokeLinecap="round"
                            strokeDasharray="2 2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />

                          {/* Segment 3: Middle to Exit (Indigo) */}
                          <motion.path 
                            d={`M ${circuitNodes[1].coord.x} ${circuitNodes[1].coord.y} Q 60 5, ${selectedNode.coord.x} ${selectedNode.coord.y}`}
                            fill="none" 
                            stroke="#6366f1" 
                            strokeWidth="0.8"
                            strokeLinecap="round"
                            strokeDasharray="2 2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                          />
                          
                          {/* Packet Animation through entire loop */}
                          <motion.circle 
                            r="0.8" 
                            fill="#fff"
                            animate={{ 
                              offsetDistance: ["0%", "100%"] 
                            }}
                            transition={{ 
                              duration: 5, 
                              repeat: Infinity, 
                              ease: "linear" 
                            }}
                            style={{ 
                              offsetPath: `path("M 22 24 Q 30 15, ${circuitNodes[0].coord.x} ${circuitNodes[0].coord.y} Q 50 10, ${circuitNodes[1].coord.x} ${circuitNodes[1].coord.y} Q 60 5, ${selectedNode.coord.x} ${selectedNode.coord.y}")` 
                            }}
                            className="shadow-[0_0_12px_#fff]"
                          />

                          {/* Node Points with distinct colors */}
                          <circle cx="22" cy="24" r="1.5" className="fill-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
                          <circle cx={circuitNodes[0].coord.x} cy={circuitNodes[0].coord.y} r="1.5" className="fill-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.6)]" />
                          <circle cx={circuitNodes[1].coord.x} cy={circuitNodes[1].coord.y} r="1.5" className="fill-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
                          <circle cx={selectedNode.coord.x} cy={selectedNode.coord.y} r="1.5" className="fill-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                          
                          {/* Signal Effect at Source */}
                          <motion.circle 
                            cx="22" cy="24" r="2" 
                            className="stroke-orange-500/30 fill-none" 
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                          />

                          {/* Signal Effect at Destination */}
                          <motion.circle 
                            cx={selectedNode.coord.x} cy={selectedNode.coord.y} r="2" 
                            className="stroke-indigo-500/30 fill-none" 
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                          />
                        </g>
                      )}
                    </svg>

                    <div className={`absolute top-6 right-6 flex flex-col gap-2 transition-all duration-500 ${!isAnonymousMode ? 'blur-sm' : ''}`}>
                       <div className="bg-slate-950/80 backdrop-blur px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${isAnonymousMode ? 'bg-orange-500 animate-pulse' : 'bg-slate-500'}`}></div>
                         <span className="text-[10px] font-bold text-slate-400">Home: <span className="text-slate-100">{isAnonymousMode ? sourceIp : 'EXPOSED'}</span></span>
                       </div>
                       <div className="bg-slate-950/80 backdrop-blur px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${isAnonymousMode ? 'bg-indigo-500' : 'bg-slate-500'}`}></div>
                         <span className="text-[10px] font-bold text-slate-400">Virtual: <span className="text-indigo-400">{isAnonymousMode ? virtualIp : 'NONE'}</span></span>
                       </div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Tunnel Status</p>
                          <div className="flex items-center gap-2">
                            <Wifi size={12} className={isActive && isAnonymousMode ? "text-emerald-400" : "text-slate-600"} />
                            <p className={`text-xs font-bold ${isActive && isAnonymousMode ? "text-emerald-400" : "text-slate-500"}`}>
                              {isActive && isAnonymousMode ? "CONNECTED" : isAnonymousMode ? "READY" : "EXPOSED"}
                            </p>
                          </div>
                        </div>
                        <div className="w-px h-8 bg-slate-800"></div>
                        <div className="flex flex-col">
                          <p className={`text-[8px] font-bold uppercase mb-1 ${isAnonymousMode ? 'text-indigo-400' : 'text-slate-600'}`}>Current Exit</p>
                          <p className="text-xs font-mono text-slate-400">{isAnonymousMode ? selectedNode.name : 'Real World'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="text-right">
                           <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Data Stream</p>
                           <p className="text-xs font-mono text-slate-300">{isAnonymousMode ? 'Live Packets' : 'Direct Link'}</p>
                         </div>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isAnonymousMode ? 'bg-indigo-500/10' : 'bg-rose-500/10'}`}>
                           <Activity size={14} className={isAnonymousMode ? "text-indigo-400" : "text-rose-500"} />
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Tor Circuit View */}
                  <div className={`bg-slate-900 border rounded-3xl p-6 space-y-6 flex flex-col shadow-2xl transition-all duration-500 ${
                    isAnonymousMode ? 'border-slate-800' : 'border-rose-500/20'
                  }`}>
                    <h3 className={`text-sm font-bold flex items-center gap-2 uppercase tracking-widest transition-colors ${isAnonymousMode ? 'text-orange-400' : 'text-rose-500'}`}>
                      {isAnonymousMode ? <Lock size={14} /> : <ShieldAlert size={14} />}
                      {isAnonymousMode ? 'Enhanced Tor Circuit' : 'Origin Leaked'}
                    </h3>
                    
                    <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5 flex-1 py-4">
                      <div className="relative pl-10">
                        <div className={`absolute left-[11px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-10 transition-colors ${isAnonymousMode ? 'bg-slate-500' : 'bg-rose-500'}`}></div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Origin</p>
                        <p className="text-sm font-bold">Local Device</p>
                        <p className="text-[10px] text-slate-600 font-mono">{sourceIp}</p>
                      </div>
                      
                      {isAnonymousMode ? circuitNodes.map((node, index) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          key={index} 
                          className="relative pl-10"
                        >
                          <div className={`absolute left-[11px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${index === 0 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]'} z-10`}></div>
                          <p className={`text-[10px] ${index === 0 ? 'text-orange-500' : 'text-orange-400'} font-bold uppercase tracking-tight`}>{node.name}</p>
                          <p className="text-sm font-bold">{node.ip}</p>
                          <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <MapPin size={8} /> {node.country}
                          </p>
                        </motion.div>
                      )) : (
                        <div className="relative pl-10 py-10">
                          <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest text-center mb-2">Circuit Broken</p>
                          <div className="w-full h-px bg-rose-500/20"></div>
                        </div>
                      )}

                      <div className="relative pl-10">
                        <div className={`absolute left-[11px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-10 transition-colors ${isAnonymousMode ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-rose-600'}`}></div>
                        <p className={`text-[10px] font-bold uppercase tracking-tight ${isAnonymousMode ? 'text-indigo-400' : 'text-rose-500'}`}>
                          {isAnonymousMode ? 'Exit Destination' : 'Exposed Target'}
                        </p>
                        <p className="text-sm font-bold">{isAnonymousMode ? selectedNode.name : 'Unknown Service'}</p>
                        <p className="text-[10px] text-indigo-500/70 font-mono">{isAnonymousMode ? virtualIp : 'NONE'}</p>
                      </div>
                    </div>

                    <button 
                      disabled={!isAnonymousMode}
                      onClick={generateNewIdentity}
                      className={`w-full py-4 transition-all rounded-2xl text-xs font-bold uppercase tracking-widest mt-4 shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                        isAnonymousMode 
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <Fingerprint size={16} />
                      Establish New Identity
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div 
                key="stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Network Nodes</h2>
                    <p className="text-slate-500 text-sm">Select a secure exit node for your traffic</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {nodes.map((node, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        setSelectedNode(node);
                        setLogs(prev => [`[SYSTEM] Node changed to ${node.name}. Re-establishing tunnel...`, ...prev.slice(0, 49)]);
                      }}
                      className={`bg-slate-900 border ${selectedNode.id === node.id ? 'border-indigo-500 bg-indigo-600/5' : 'border-slate-800'} rounded-2xl p-4 flex items-center justify-between group hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all cursor-pointer`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{node.flag}</span>
                        <div>
                          <p className="font-bold">{node.name}</p>
                          <p className={`text-[10px] uppercase font-bold tracking-widest ${node.status === 'Optimal' ? 'text-emerald-500' : node.status === 'Busy' ? 'text-orange-500' : 'text-rose-500'}`}>
                            {node.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Latency</p>
                          <p className="text-sm font-mono text-emerald-400">{node.latency}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-xl ${selectedNode.id === node.id ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'} flex items-center justify-center transition-colors`}>
                          {selectedNode.id === node.id ? <ShieldCheck size={18} /> : <ChevronRight size={18} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'logs' && (
              <motion.div 
                key="logs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-5xl mx-auto space-y-6 flex flex-col h-full"
              >
                <div className="flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                      <Terminal size={24} className="text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-bold">Shield Logs</h2>
                  </div>
                  <button 
                    onClick={() => setLogs(["[CLEARED] All logs wiped.", "System tracking restarted."])}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    CLEAR ALL
                  </button>
                </div>
                
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-3xl p-6 font-mono text-[11px] overflow-y-auto custom-scrollbar shadow-inner mb-20 md:mb-0">
                  {logs.map((log, i) => (
                    <div key={i} className="group border-b border-white/5 py-2 flex items-start gap-4">
                      <span className="text-slate-700 shrink-0 select-none">{(logs.length - i).toString().padStart(3, '0')}</span>
                      <span className="text-slate-500 shrink-0 select-none">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                      <span className={`${log.includes('BLOCKED') ? 'text-rose-400 bg-rose-400/10 px-1 rounded' : log.includes('established') ? 'text-emerald-400 font-bold underline' : 'text-slate-300'} break-all`}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-3xl mx-auto space-y-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700">
                    <Settings size={24} className="text-slate-300" />
                  </div>
                  <h2 className="text-3xl font-bold">Management</h2>
                </div>

                <div className="space-y-8">
                  <section className="space-y-4">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] px-1">Network Protection</h3>
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl divide-y divide-slate-800 overflow-hidden shadow-lg">
                      <div className="p-5 flex items-center justify-between">
                        <div>
                          <p className="font-bold">Aggressive Ad Blocking</p>
                          <p className="text-xs text-slate-500">Filters non-standard ad providers & telemetry</p>
                        </div>
                        <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1"><div className="w-4 h-4 bg-white rounded-full shadow-lg" /></div>
                      </div>
                      <div className="p-5 flex items-center justify-between">
                        <div>
                          <p className="font-bold">DNS-over-HTTPS (DoH)</p>
                          <p className="text-xs text-slate-500">Encrypt your DNS queries on system layer</p>
                        </div>
                        <div 
                          onClick={() => {
                            setIsDohEnabled(!isDohEnabled);
                            setLogs(prev => [`[DNS] DoH ${!isDohEnabled ? 'Enabled' : 'Disabled'}. Active on system level.`, ...prev.slice(0, 49)]);
                          }}
                          className={`w-12 h-6 rounded-full cursor-pointer transition-all p-1 flex items-center ${isDohEnabled ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-800'}`}
                        >
                          <div className={`w-4 h-4 rounded-full shadow-lg transition-all duration-300 ${isDohEnabled ? 'translate-x-6 bg-white' : 'translate-x-0 bg-slate-500'}`} />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] px-1">OS Level Hooks</h3>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isKernelFilterActive ? 'bg-purple-600/20' : 'bg-slate-800'}`}>
                            <Activity size={18} className={isKernelFilterActive ? 'text-purple-400' : 'text-slate-500'} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">Kernel Packet Filter</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Bypasses App Restrictions</p>
                          </div>
                        </div>
                        <div 
                          onClick={() => {
                            setIsKernelFilterActive(!isKernelFilterActive);
                            setLogs(prev => [`[SYSTEM] Kernel Filter: ${!isKernelFilterActive ? 'HOOKED' : 'DETACHED'}`, ...prev.slice(0, 49)]);
                          }}
                          className={`w-12 h-6 rounded-full cursor-pointer transition-all p-1 flex items-center ${isKernelFilterActive ? 'bg-purple-600' : 'bg-slate-800'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform ${isKernelFilterActive ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isGlobalDnsActive ? 'bg-emerald-600/20' : 'bg-slate-800'}`}>
                            <Database size={18} className={isGlobalDnsActive ? 'text-emerald-400' : 'text-slate-500'} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">System-Wide Private DNS</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Global Ad Suppression</p>
                          </div>
                        </div>
                        <div 
                          onClick={() => {
                            setIsGlobalDnsActive(!isGlobalDnsActive);
                            setLogs(prev => [`[DNS] Global Hijack: ${!isGlobalDnsActive ? 'ACTIVE' : 'INACTIVE'}`, ...prev.slice(0, 49)]);
                          }}
                          className={`w-12 h-6 rounded-full cursor-pointer transition-all p-1 flex items-center ${isGlobalDnsActive ? 'bg-emerald-600' : 'bg-slate-800'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform ${isGlobalDnsActive ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xs font-black text-rose-500/50 uppercase tracking-[0.2em] px-1">Network Level Setup</h3>
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/30">
                          <Wifi size={24} className="text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-indigo-100">Setup Shield on Device</h4>
                          <p className="text-xs text-slate-400 leading-relaxed mt-1">To block ads in EVERY application, you must configure your device to use the ShieldNet Secure Core on network level.</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                          <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Android / iOS (Private DNS)</p>
                          <div className="flex items-center justify-between text-xs font-mono bg-slate-950 p-2 rounded-lg border border-slate-700/50 text-slate-200">
                            <span>dns.shieldnet.secure</span>
                            <Share2 size={12} className="cursor-pointer hover:text-indigo-400 transition-colors" />
                          </div>
                          <p className="text-[9px] text-slate-500 mt-2">Settings → Network → Private DNS → Hostname</p>
                        </div>

                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                          <p className="text-[10px] font-black text-orange-400 uppercase mb-2">PC / Mac (VPN Profile)</p>
                          <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-700">
                            Download OVPN Config
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                   <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] px-1">Privacy Engine</h3>
                   <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-lg">
                     <div className="flex items-center justify-between pr-1">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                           <Lock size={18} className="text-orange-500" />
                         </div>
                         <div>
                           <p className="font-bold">Onion Routing (Tor)</p>
                           <p className="text-xs text-slate-500">Tunnel through 3 random global relays</p>
                         </div>
                       </div>
                       <div 
                         onClick={() => setIsTorActive(!isTorActive)}
                         className={`w-12 h-6 rounded-full cursor-pointer transition-all p-1 flex items-center ${isTorActive ? 'bg-orange-500' : 'bg-slate-800'}`}
                       >
                         <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform ${isTorActive ? 'translate-x-6' : 'translate-x-0'}`} />
                       </div>
                     </div>
                   </div>
                  </section>

                  <section className="space-y-4">
                   <h3 className="text-xs font-black text-indigo-500/50 uppercase tracking-[0.2em] px-1">Support</h3>
                   <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                            <ExternalLink size={24} className="text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-200">Connect Developer</p>
                            <p className="text-xs text-slate-500">Visit portfolio & professional profile</p>
                          </div>
                        </div>
                        <a 
                          href="https://nitin-8268.github.io/codexx" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest active:scale-95 text-center min-w-[160px]"
                        >
                          Open Portfolio
                        </a>
                      </div>
                   </div>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Navbar Bottom */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-slate-900/90 border-t border-slate-800 flex items-center justify-around px-4 z-20 backdrop-blur-xl pb-2">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'home' ? 'text-indigo-400' : 'text-slate-500'}`}>
            <Globe size={20} />
            <span className="text-[10px] font-bold uppercase transition-all tracking-tight">Dash</span>
          </button>
          <button onClick={() => setActiveTab('identity')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'identity' ? 'text-indigo-400' : 'text-slate-500'}`}>
            <Fingerprint size={20} />
            <span className="text-[10px] font-bold uppercase transition-all tracking-tight">WhoIS</span>
          </button>
          <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'stats' ? 'text-indigo-400' : 'text-slate-500'}`}>
            <Server size={20} />
            <span className="text-[10px] font-bold uppercase transition-all tracking-tight">Nodes</span>
          </button>
          <button onClick={() => setActiveTab('logs')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'logs' ? 'text-indigo-400' : 'text-slate-500'}`}>
            <Terminal size={20} />
            <span className="text-[10px] font-bold uppercase transition-all tracking-tight">Logs</span>
          </button>
        </nav>
      </main>
    </div>
  );
}
