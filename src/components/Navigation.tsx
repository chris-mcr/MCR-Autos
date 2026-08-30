'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CartButton from "./CartButton";

interface NavigationProps {
  currentPage?: "home" | "shop" | "dashboard" | "account" | "cart" | "login";
  showCart?: boolean;
  user?: { name: string; email: string } | null;
  onLogout?: () => void;
  onRefresh?: () => Promise<void>;
  showMinimal?: boolean;
}

export default function Navigation({
  currentPage = "home",
  showCart = true,
  user = null,
  onLogout,
  onRefresh,
  showMinimal = false,
}: NavigationProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    if (onLogout) onLogout();
    router.push("/");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", show: user, testId: "nav-dashboard" },
    { href: "/shop",      label: "Shop",      show: true,  testId: "nav-shop" },
    { href: "/account",   label: "Account",   show: user, testId: "nav-account" },
  ];

  const getLinkClasses = (page: string) => {
    const base = "px-3 py-4 border-b-2 text-sm transition-colors whitespace-nowrap font-medium";
    const active   = "border-[color:var(--accent)] text-[color:var(--accent)]";
    const inactive = "border-transparent hover:border-[color:var(--edge-mid)]";
    return `${base} ${currentPage === page ? active : inactive}`;
  };

  const inactiveLinkStyle = { color: 'var(--text-2)' } as React.CSSProperties;
  const activeLinkStyle   = { color: 'var(--accent)' } as React.CSSProperties;
  const getLinkStyle = (page: string) => currentPage === page ? activeLinkStyle : inactiveLinkStyle;

  const getNavTestId = (href: string) => href === "/" ? "nav-home" : `nav-${href.split("/")[1]}`;

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{ background: 'rgba(12, 12, 16, 0.96)', borderBottom: '1px solid var(--edge)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-6">

          {/* Left — Logo */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
              data-testid="home-logo-button"
              aria-label="Go to home page"
            >
              <span className="text-lg" aria-hidden="true">🔧</span>
              <span className="font-code font-semibold tracking-widest text-sm uppercase" style={{ color: 'var(--accent)' }}>
                MCR
              </span>
              <span className="font-code text-sm" style={{ color: 'var(--text-3)' }}>autos</span>
            </button>
          </div>

          {/* Desktop nav + right section */}
          {!showMinimal && (
            <div className="hidden md:flex items-center gap-6 flex-1">
              {(user || currentPage !== "home") && (
                <div className="flex space-x-1 flex-1 justify-center">
                  {navLinks.map((link) =>
                    link.show && (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={getLinkClasses(link.href.split("/")[1])}
                        style={getLinkStyle(link.href.split("/")[1])}
                        data-testid={getNavTestId(link.href)}
                        aria-label={link.label}
                        aria-current={currentPage === link.href.split("/")[1] ? "page" : undefined}
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              )}

              <div className={`flex items-center gap-3 ${(user || currentPage !== "home") ? "border-l pl-6" : ""}`}
                style={{ borderColor: 'var(--edge)' }}>
                {showCart && <CartButton />}
                {user ? (
                  <>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-code" style={{ color: 'var(--text-3)' }}>logged in as</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{user.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {onRefresh && (
                        <button
                          onClick={onRefresh}
                          data-testid="refresh-button"
                          aria-label="Refresh page data"
                          className="px-3 py-2 rounded text-sm font-medium transition-colors"
                          style={{ color: 'var(--text-2)', background: 'var(--bg-overlay)' }}
                          title="Refresh data"
                        >
                          ↻
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        data-testid="logout-button"
                        aria-label="Log out of account"
                        className="px-3 py-2 rounded text-sm font-medium transition-colors"
                        style={{ color: 'var(--text-3)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/login"
                    data-testid="signin-button"
                    aria-label="Sign in to your account"
                    className="btn-amber"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded transition-colors"
            style={{ color: 'var(--text-2)' }}
            data-testid="mobile-menu-button"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="text-lg">{mobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && !showMinimal && (
          <div
            className="md:hidden mt-3 pt-3 space-y-1"
            style={{ borderTop: '1px solid var(--edge)' }}
            role="region"
            aria-label="Mobile navigation menu"
          >
            {navLinks.map((link) =>
              link.show && (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded text-sm font-medium transition-colors"
                  style={{
                    color: currentPage === link.href.split("/")[1] ? 'var(--accent)' : 'var(--text-2)',
                    background: currentPage === link.href.split("/")[1] ? 'var(--accent-dim)' : 'transparent',
                  }}
                  data-testid={`${getNavTestId(link.href)}-mobile`}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={link.label}
                  aria-current={currentPage === link.href.split("/")[1] ? "page" : undefined}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-2 space-y-1" style={{ borderTop: '1px solid var(--edge)' }}>
              {showCart && (
                <div className="px-3 py-2" onClick={() => setMobileMenuOpen(false)}>
                  <CartButton />
                </div>
              )}
              {onRefresh && (
                <button
                  onClick={() => { onRefresh(); setMobileMenuOpen(false); }}
                  data-testid="refresh-button"
                  aria-label="Refresh page data"
                  className="w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors"
                  style={{ color: 'var(--text-2)', background: 'var(--bg-overlay)' }}
                >
                  ↻ Refresh
                </button>
              )}
              {user ? (
                <>
                  <div className="px-3 py-2">
                    <p className="text-xs font-code" style={{ color: 'var(--text-3)' }}>logged in as</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{user.name}</p>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    data-testid="logout-button"
                    aria-label="Log out of account"
                    className="w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors"
                    style={{ color: 'var(--text-3)' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  data-testid="signin-button"
                  aria-label="Sign in to your account"
                  className="block px-3 py-2 rounded text-sm font-semibold text-center btn-amber"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}
