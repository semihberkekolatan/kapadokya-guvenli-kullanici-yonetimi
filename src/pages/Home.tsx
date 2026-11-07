import { Link } from 'react-router-dom';
import { Fingerprint, Zap, ShieldCheck, User } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Karşılama Sayfası (PDF'deki index.php)
 */
export default function Home() {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full mb-10 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Authorized System V2.1
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.9]">
            Dijital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Güvenlik</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
            Kapadokya Üniversitesi Web Programlama projesi için <span className="text-zinc-200">Semih Berke Kolatan</span> tarafından tasarlanan gelişmiş kimlik yönetimi.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-24">
            <Link
              to="/register"
              className="group relative px-12 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10 overflow-hidden"
            >
              <span className="relative z-10">Protokole Katıl</span>
              <div className="absolute inset-0 bg-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </Link>
            <Link
              to="/login"
              className="px-12 py-5 bg-zinc-900/50 backdrop-blur-md text-white border border-white/5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Sisteme Eriş
            </Link>
          </div>
        </motion.div>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            { icon: Fingerprint, title: "Kimlik Doğrulama", desc: "Benzersiz veri şifreleme ve hashleme protokolleri." },
            { icon: ShieldCheck, title: "Kapadokya Güvenliği", desc: "Üniversite standartlarında yüksek koruma katmanı." },
            { icon: User, title: "Kullanıcı Dostu", desc: "Modern tasarım ile akıcı kullanıcı deneyimi." },
            { icon: Zap, title: "Anlık Analitik", desc: "İşlem loglarını ve sistem durumunu anlık takip edin." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + (i * 0.1) }}
              className="glass-card p-8 rounded-[2.5rem] border-white/5 group hover:border-indigo-500/30 transition-all cursor-default"
            >
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight leading-none">{feature.title}</h3>
              <p className="text-zinc-500 text-xs font-medium leading-relaxed uppercase tracking-tighter opacity-80">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
