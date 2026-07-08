"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    router.push("/");
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }} role="application" aria-label="Account page">
      <Navigation currentPage="account" showCart={true} user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Profile */}
          <div className="card p-8" role="region" aria-label="Profile information">
            <h2 className="font-display text-2xl mb-7" style={{ color: 'var(--text-1)' }}>Profile Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-code uppercase tracking-wide mb-2" style={{ color: 'var(--text-3)' }}>Name</label>
                <p className="text-base font-semibold" style={{ color: 'var(--text-1)' }} aria-label="User name">{user.name}</p>
              </div>
              <div style={{ borderTop: '1px solid var(--edge)', paddingTop: '1.5rem' }}>
                <label className="block text-xs font-code uppercase tracking-wide mb-2" style={{ color: 'var(--text-3)' }}>Email</label>
                <p data-testid="user-email" className="text-base" style={{ color: 'var(--text-2)' }} aria-label="User email">{user.email}</p>
              </div>
              <div style={{ borderTop: '1px solid var(--edge)', paddingTop: '1.5rem' }}>
                <label className="block text-xs font-code uppercase tracking-wide mb-2" style={{ color: 'var(--text-3)' }}>User ID</label>
                <p
                  data-testid="user-id"
                  className="text-sm font-code p-3 rounded"
                  style={{ color: 'var(--text-2)', background: 'var(--bg-overlay)', border: '1px solid var(--edge-mid)' }}
                  aria-label="User ID"
                >
                  {user.id}
                </p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="card p-8" role="region" aria-label="Account settings">
            <h2 className="font-display text-2xl mb-7" style={{ color: 'var(--text-1)' }}>Account Settings</h2>
            <div className="space-y-2" role="menu" aria-label="Account options">
              {[
                { label: "Change Password",           icon: "🔐", ariaLabel: "Change password" },
                { label: "Two-Factor Authentication", icon: "🛡️", ariaLabel: "Two-factor authentication settings" },
                { label: "Notification Preferences",  icon: "🔔", ariaLabel: "Notification preferences" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full px-4 py-3 rounded text-left text-sm font-medium transition-colors"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--edge)', color: 'var(--text-2)' }}
                  role="menuitem"
                  aria-label={item.ariaLabel}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-1)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--edge)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
                >
                  {item.icon} {item.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 rounded text-left text-sm font-medium transition-colors mt-2"
                style={{ background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
                role="menuitem"
                aria-label="Log out"
              >
                🚪 Logout
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
