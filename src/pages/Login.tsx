import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle, Shield, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [formData, setFormData] = useState({ email: '', sifre: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.search.includes('registered=true')) {
      setSuccess('Hesabınız Başarıyla Oluşturuldu.');
    }
    
    const checkIP = async () => {
      try {
        const data = await api.checkIP();
        if (data.blocked) {
          setBlocked(true);
          setError(data.message);
        }
      } catch (err) {
        console.error("IP kontrolü başarısız:", err);
      }
    };
    checkIP();
  }, [location]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (blocked) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.login(formData);
      
      if (res.success) {
        onLogin(res.user);
        navigate('/dashboard');
      } else {
        const ipData = await api.checkIP();
        if (ipData.blocked) {
          setBlocked(true);
          setError(ipData.message);
        } else {
          setError(res.error || 'Kimlik Bilgileri Doğrulanamadı.');
        }
      }
    } catch (err: any) {
      setError('Güvenli Sunucu Bağlantı Hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[90vh] flex flex-col items-center justify-center p-6 relative">
      {/* Dev Info Badge */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed top-8 right-8 text-right hidden lg:block"
      >
        <span className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.3em] block mb-1">Developer Credentials</span>
        <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/5 px-4 py-2 rounded-full backdrop-blur-md">
          Semih Berke Kolatan <span className="text-indigo-500 ml-2">24097002</span>
        </span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] relative"
      >
        <div className="absolute -inset-10 bg-indigo-500/10 rounded-[5rem] blur-[80px] -z-10"></div>
        
        <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.9)] rounded-[4rem] p-10 md:p-20 relative overflow-hidden group">
          {/* Subtle patterns */}
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 pointer-events-none">
            <Lock className="h-48 w-48" />
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex p-4 bg-indigo-500/15 rounded-2xl mb-6">
              <Shield className="h-8 w-8 text-indigo-500" />
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-none">
              Giriş <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Yap</span>
            </h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Auth Protocol V2.1</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {(error || success) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl flex items-start gap-4 text-[10px] font-black uppercase tracking-widest border ${
                  error ? 'bg-red-500/5 border-red-500/10 text-red-500' : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500'
                }`}
              >
                {error ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle className="h-4 w-4 shrink-0" />}
                <span className="leading-relaxed">{error || success}</span>
              </motion.div>
            )}

            <div className="space-y-3 group">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors">Kimlik Kimliği</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  disabled={blocked}
                  placeholder="ID@KAPADOKYA.EDU.TR"
                  className="w-full pl-14 pr-6 py-5 bg-zinc-950/80 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all placeholder:text-zinc-800 text-sm font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-3 group">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors">Eriş Anahtarı</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  disabled={blocked}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-zinc-950/80 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all placeholder:text-zinc-800 text-sm font-bold"
                  value={formData.sifre}
                  onChange={(e) => setFormData({...formData, sifre: e.target.value})}
                />
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || blocked}
                className="w-full relative group/btn overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0 bg-indigo-600 group-hover:bg-indigo-500 transition-colors"></div>
                <div className="relative flex justify-center items-center gap-3 py-5 px-6 text-white text-[11px] font-black uppercase tracking-[0.2em] transform active:scale-95 transition-all disabled:opacity-50">
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Zap className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sisteme Eriş
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          <div className="mt-14 text-center border-t border-white/5 pt-8">
            <Link to="/register" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-all flex items-center justify-center gap-2">
              Henüz Kayıtlı Değil Misiniz? <span className="text-white underline underline-offset-8 decoration-indigo-500/30 hover:text-indigo-400">Üyelik Oluştur</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
