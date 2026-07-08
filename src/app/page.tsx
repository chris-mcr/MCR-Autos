'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";

const features = [
  {
    title: "Genuine & OE-Quality Parts",
    body: "Brakes, filters, electrical, engine, suspension and exterior parts sourced to match manufacturer specifications.",
  },
  {
    title: "Fits Your Vehicle",
    body: "Browse by category and find the right part for your make and model, with clear fitment details.",
  },
  {
    title: "Trade Prices",
    body: "Competitive pricing on everyday servicing parts and repairs — for DIY drivers and workshops alike.",
  },
  {
    title: "Fast UK Shipping",
    body: "Next-day dispatch on stocked lines so you can get back on the road sooner.",
  },
  {
    title: "1 Year Warranty",
    body: "Every part is covered by a minimum 12-month warranty for total peace of mind.",
  },
  {
    title: "Expert Support",
    body: "Not sure which part you need? Our team can help you find the right fit first time.",
  },
];

export default function Home() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <p className="font-code text-sm" style={{ color: 'var(--text-3)' }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Navigation currentPage="home" showCart={false} user={user} />

      {user ? (
        /* ── Logged-in hero ── */
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-24">
          <div className="anim-fade-up">
            <p className="font-code text-xs tracking-widest uppercase mb-6" style={{ color: 'var(--accent)' }}>
              Welcome back
            </p>
            <h2 className="font-display text-6xl lg:text-7xl leading-[1.05] mb-7" style={{ color: 'var(--text-1)' }}>
              Let&apos;s get you<br />
              back on the road, {user.name}.
            </h2>
            <p className="text-lg max-w-md mb-10" style={{ color: 'var(--text-2)' }}>
              Browse thousands of quality car parts, track your orders and reorder your regular servicing items in seconds.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="btn-amber" data-testid="shop-button">
                Shop Parts
              </Link>
              <Link href="/dashboard" className="btn-ghost" data-testid="dashboard-button">
                My Orders
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* ── Logged-out hero ── */}
          <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20">
            <div className="anim-fade-up max-w-2xl">
              <p className="font-code text-xs tracking-widest uppercase mb-6" style={{ color: 'var(--accent)' }}>
                Quality car parts, delivered
              </p>
              <h2 className="font-display text-6xl lg:text-7xl leading-[1.05] mb-7" style={{ color: 'var(--text-1)' }}>
                The right part.<br />
                Every time.
              </h2>
              <p className="text-lg max-w-md mb-10" style={{ color: 'var(--text-2)' }}>
                MCR Autos stocks brakes, filters, electrical, engine, suspension and exterior parts for every make and model — at trade prices.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/login" className="btn-amber" data-testid="get-started-button">
                  Shop Now
                </Link>
                <Link href="/login" className="btn-ghost" data-testid="account-button">
                  Sign In
                </Link>
              </div>
            </div>

            {/* Intro cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-20">
              {[
                {
                  num: "01",
                  title: "Huge Range",
                  body: "Everyday servicing parts and harder-to-find components, all in one place.",
                  tag: "Thousands of lines in stock",
                },
                {
                  num: "02",
                  title: "Quality You Can Trust",
                  body: "OE-quality parts from trusted manufacturers, backed by warranty.",
                  tag: "12-month minimum warranty",
                },
                {
                  num: "03",
                  title: "Fast Delivery",
                  body: "Order today and get your parts dispatched next working day.",
                  tag: "Free shipping over £50",
                },
              ].map((card, i) => (
                <div
                  key={card.num}
                  className={`card p-8 anim-fade-up anim-d${i + 2}`}
                >
                  <p className="font-code text-xs mb-5" style={{ color: 'var(--text-3)' }}>{card.num}</p>
                  <h3 className="font-display text-xl mb-3" style={{ color: 'var(--text-1)' }}>
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-2)' }}>
                    {card.body}
                  </p>
                  <p className="font-code text-xs" style={{ color: 'var(--accent)' }}>{card.tag}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Features grid ── */}
          <section className="py-20" style={{ borderTop: '1px solid var(--edge)' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="mb-14 anim-fade-up">
                <p className="font-code text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>
                  Why MCR
                </p>
                <h3 className="font-display text-4xl" style={{ color: 'var(--text-1)' }}>
                  Everything you need to<br />service and repair your car.
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <div
                    key={feature.title}
                    className={`p-6 rounded-lg anim-fade-up anim-d${i + 1}`}
                    style={{
                      borderLeft: '2px solid var(--accent)',
                      background: 'var(--bg-surface)',
                    }}
                  >
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--text-1)' }}>
                      {feature.title}
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                      {feature.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: '1px solid var(--edge)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <span className="font-code text-xs" style={{ color: 'var(--text-3)' }}>
            🔧 MCR AUTOS
          </span>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            Quality car parts · Fast UK delivery
          </p>
        </div>
      </footer>
    </div>
  );
}
