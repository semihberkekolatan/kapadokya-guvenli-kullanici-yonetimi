import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { UserPlus, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Kullanıcı Kayıt Sayfası (PDF 5.3 gereksinimi)
 */
export default function Register() {
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    sifre: '',
    sifreTekrar: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.sifre !== formData.sifreTekrar) {
       setError('Şifreler birbiriyle eşleşmiyor.');
       return;
    }

    if (formData.sifre.length < 8) {
      setError('Güvenlik için şifre en az 8 karakter olmalıdır.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.register({
        ad: formData.ad,
        soyad: formData.soyad,
        email: formData.email,
        sifre: formData.sifre
      });

      if (res.success) {
        navigate('/login?registered=true');
      } else {
        setError(res.error || 'Sistem kaydı reddetti.');
      }
    } catch (err: any) {
      setError('Sunucu bağlantısı kısıtlandı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 px-6 w-full flex flex-col items-center justify-center relative min-h-[95vh] overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 translate-x-[-20%] translate-y-[-20%]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[620px] relative z-10"
      >
        <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.9)] rounded-[4.5rem] p-10 md:p-20 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 pointer-events-none">
            <UserPlus className="h-48 w-48" />
          </div>

          <div className="mb-14 text-center">
            <div className="inline-flex p-4 bg-indigo-500/15 rounded-2xl mb-6">
              <UserPlus className="h-8 w-8 text-indigo-500" />
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-3 leading-none">
              Sisteme <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 text-6xl">Katıl</span>
            </h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">
              Security Register v2.1
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleRegister}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl flex items-start gap-4 text-red-500 text-[10px] font-black uppercase tracking-widest leading-relaxed"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 group text-left">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors">İsim</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="AHMET"
                    className="w-full pl-12 pr-6 py-4 bg-zinc-950/80 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all placeholder:text-zinc-800 text-sm font-bold"
                    value={formData.ad}
                    onChange={(e) => setFormData({...formData, ad: e.target.value})}
                  />
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                </div>
              </div>
              <div className="space-y-3 group text-left">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors">Soyisim</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="YILMAZ"
                    className="w-full pl-12 pr-6 py-4 bg-zinc-950/80 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all placeholder:text-zinc-800 text-sm font-bold"
                    value={formData.soyad}
                    onChange={(e) => setFormData({...formData, soyad: e.target.value})}
                  />
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-3 group text-left">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors">Kurumsal E-Posta</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="ID@KAPADOKYA.EDU.TR"
                  className="w-full pl-12 pr-6 py-4 bg-zinc-950/80 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all placeholder:text-zinc-800 text-sm font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 group text-left">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors">Güvenli Şifre</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-6 py-4 bg-zinc-950/80 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all placeholder:text-zinc-800 text-sm font-bold"
                    value={formData.sifre}
                    onChange={(e) => setFormData({...formData, sifre: e.target.value})}
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                </div>
              </div>
              <div className="space-y-3 group text-left">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors">Onay Anahtarı</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-6 py-4 bg-zinc-950/80 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all placeholder:text-zinc-800 text-sm font-bold"
                    value={formData.sifreTekrar}
                    onChange={(e) => setFormData({...formData, sifreTekrar: e.target.value})}
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group/btn overflow-hidden rounded-[1.5rem] bg-white text-black py-5 px-8 text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-white/5"
              >
                {loading ? 'İnceleme Başlatıldı...' : 'Kaydı Onayla ve Katıl'}
              </button>
            </div>
          </form>

          <div className="mt-14 text-center border-t border-white/5 pt-8">
             <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-100 transition-all flex items-center justify-center gap-2">
               Zaten Üye Misiniz? <span className="text-white underline underline-offset-8 decoration-indigo-500/30 hover:text-indigo-400 transition-all">Oturum Açın</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
