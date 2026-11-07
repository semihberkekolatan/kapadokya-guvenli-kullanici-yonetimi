/**
 * API Servisi
 * Frontend ve Backend (SQLite) arasındaki iletişimi sağlar.
 * PDF'deki PHP mantığını simüle eden API çağrılarını içerir.
 */

export const api = {
  checkIP: async () => {
    const res = await fetch('/api/auth/check-ip', { method: 'POST' });
    return res.json();
  },
  
  register: async (data: any) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  login: async (data: any) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  getDashboard: async (userId: string) => {
    const res = await fetch(`/api/dashboard/${userId}`);
    return res.json();
  },
  
  logout: async (userId: string) => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  }
};
