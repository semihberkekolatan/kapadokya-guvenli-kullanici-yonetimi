import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { LogOut, User as UserIcon, Shield, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';

interface LayoutProps {
  children: ReactNode;
  user: any;
  onLogout: () => void;
}

/**
 * Ortak Düzen Bileşeni
 * Navigasyon çubuğu ve sayfa iskeletini içerir.
 */
export default function Layout({ children, user, onLogout }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (user) {
        await api.logout(user.id.toString());
      }
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-indigo-500/30">
      <nav className="bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-500">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-white tracking-tighter leading-tight uppercase">
                    Kapadokya <span className="text-indigo-500">Auth</span>
                  </span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">
                    Digital Security
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-6">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all border border-red-500/20"
                  >
                    <LogOut className="h-4 w-4" />
                    Güvenli Çıkış
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                  >
                    Giriş
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-zinc-100 text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-white/5 scale-100 hover:scale-105 active:scale-95"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden">
        {/* Dekoratif Arka Plan Işıkları */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000"></div>
        
        <div className="w-full">
          {children}
        </div>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 relative bg-zinc-950/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">System Developer Active</span>
             </div>
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
              &copy; 2026 UNIVERSITY OF KAPADOKYA
            </span>
            <div className="flex items-center gap-3">
              <span className="text-zinc-300 text-[11px] font-black uppercase tracking-[0.2em] leading-none">
                Semih Berke Kolatan <span className="text-indigo-500 ml-2">24097002</span>
              </span>
            </div>
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col items-center md:items-end gap-2 text-zinc-800">
               <span className="text-[9px] font-black uppercase tracking-widest">Security: AES-256</span>
               <span className="text-[9px] font-black uppercase tracking-widest">Protocol: V2.1 Beta</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
