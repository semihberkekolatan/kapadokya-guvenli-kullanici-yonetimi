import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { 
  User as UserIcon, 
  History, 
  ShieldAlert, 
  Clock, 
  Info, 
  Fingerprint, 
  Mail, 
  Calendar, 
  Activity, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user: loggedUser }: DashboardProps) {
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [failedLogs, setFailedLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getDashboard(loggedUser.id.toString());
        setProfile(data.user);
        setLogs(data.logs);
        setFailedLogs(data.failedLogs);
      } catch (err) {
        console.error("Veri yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loggedUser.id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative h-12 w-12 text-indigo-500">
           <Activity className="h-full w-full animate-pulse" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Protokoller Eşitleniyor...</span>
      </div>
    );
  }

  const stats = [
    { label: 'Erişim Rolü', value: 'Administrator', icon: ShieldCheck, color: 'text-indigo-500' },
    { label: 'Oturum Kaydı', value: `${logs.length} İşlem`, icon: Activity, color: 'text-emerald-500' },
    { label: 'Kısıtlamalar', value: `${failedLogs.length} Uyarı`, icon: ShieldAlert, color: 'text-red-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Developer Profile: Semih Berke Kolatan (24097002)</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-tight">
                    Hoş Geldin, <span className="text-indigo-500 font-black">{profile?.ad}</span>
                </h1>
            </div>
            
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">System Authority</span>
               <div className="flex gap-3">
                 <div className="px-5 py-3 bg-zinc-900 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400">
                   BGY206 Project
                 </div>
               </div>
            </div>
        </div>

      {/* İstatistik Özetleri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2.2rem] flex flex-col gap-6 group hover:border-indigo-500/20 transition-all duration-500"
          >
            <div className={`p-4 rounded-2xl bg-zinc-950/80 w-fit ${stat.color} shadow-lg shadow-black/20`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Panel: Aktiviteler */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card p-10 md:p-14 rounded-[3rem] border-white/5"
        >
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                <History className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">İşlem Günlüğü</h3>
            </div>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border border-white/5 px-4 py-2 rounded-full">
              Canlı Akış
            </span>
          </div>

          <div className="space-y-10">
            {logs.length > 0 ? logs.map((log: any, idx: number) => (
              <div key={log.id} className="relative pl-12 pb-2">
                {/* Timeline Line */}
                {idx !== logs.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-px bg-zinc-800/40" />
                )}
                
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-zinc-950 shadow-lg flex items-center justify-center z-10 ${
                  log.islem_tipi === 'giris_basarili' ? 'bg-emerald-500' : 
                  log.islem_tipi === 'cikis' ? 'bg-zinc-600' : 'bg-red-500'
                }`} />

                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-zinc-950/50 rounded-lg w-fit ${
                      log.islem_tipi === 'giris_basarili' ? 'text-emerald-400' : 
                      log.islem_tipi === 'cikis' ? 'text-zinc-500' : 'text-red-500'
                    }`}>
                      {log.islem_tipi.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-bold">
                       <Clock className="h-3 w-3" />
                       {new Date(log.created_at).toLocaleString('tr-TR')}
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-4">{log.aciklama}</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-2 text-[9px] text-zinc-500 bg-zinc-950/50 border border-white/5 px-4 py-1.5 rounded-full font-black uppercase tracking-widest">
                       IP: <span className="text-zinc-300 font-mono tracking-normal text-[10px]">{log.ip_adresi}</span>
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-20">
                <div className="inline-flex p-6 rounded-[2rem] bg-zinc-950/50 border border-white/5 mb-6">
                   <Info className="h-8 w-8 text-zinc-700" />
                </div>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Veri akışı yok.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sağ Panel */}
        <div className="flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-10 rounded-[3rem] border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 pointer-events-none">
               <Fingerprint className="h-40 w-40" />
            </div>

            <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-10 pb-4 border-b border-white/5">Digital Shield Profile</h4>
            
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-zinc-950 rounded-2xl text-indigo-500 border border-white/5">
                   <UserIcon className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-0.5">Developer Identity</p>
                   <p className="text-sm font-bold text-zinc-200">Semih Berke Kolatan</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-zinc-950 rounded-2xl text-indigo-500 border border-white/5">
                   <Fingerprint className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-0.5">Student Number</p>
                   <p className="text-sm font-bold text-zinc-200">24097002</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-zinc-950 rounded-2xl text-indigo-500 border border-white/5">
                   <UserIcon className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-0.5">Session User</p>
                   <p className="text-sm font-bold text-zinc-200">{profile?.ad} {profile?.soyad}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-10 rounded-[3rem] border-red-500/10"
          >
            <h4 className="text-xs font-black text-red-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
              <ShieldAlert className="h-4 w-4" />
              Kısıtlama Logları
            </h4>
            
            <div className="space-y-4">
              {failedLogs.length > 0 ? failedLogs.map((log: any) => (
                <div key={log.id} className="bg-red-500/5 p-5 rounded-2xl border border-red-500/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Security Alert</span>
                    <span className="text-[9px] text-zinc-600 font-bold">{new Date(log.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-400">IP: {log.ip_adresi}</p>
                </div>
              )) : (
                <div className="flex items-center gap-3 p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                   <ShieldCheck className="h-4 w-4 text-emerald-500" />
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sistem Güvende</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
