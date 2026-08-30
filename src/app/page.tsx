'use client'

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Carousel from "@/components/Carousel";
import ImageCarousel from "@/components/ImageCarousel";
import PartFinder from "@/components/PartFinder";
import Accordion from "@/components/Accordion";
import Icon from "@/components/Icon";
import { products, categories } from "@/lib/products";

const trustItems = [
  { icon: "shield", title: "12-month warranty", body: "On every part we sell." },
  { icon: "truck", title: "Free UK delivery", body: "On orders over £50." },
  { icon: "returns", title: "30-day returns", body: "Hassle-free, no quibble." },
  { icon: "chat", title: "Expert support", body: "Not sure? We'll help you fit it." },
];

const categoryImages: Record<string, string> = {
  Brakes: "/parts-images/cat-brakes.webp",
  Filters: "/parts-images/cat-filters.webp",
  Engine: "/parts-images/cat-engine.webp",
  Electrical: "/parts-images/cat-electrical.webp",
  Suspension: "/parts-images/cat-suspension.webp",
  Exterior: "/parts-images/cat-exterior.webp",
};

const promoTiles = [
  {
    title: "Trade accounts",
    body: "Buy in bulk at trade prices — built for workshops and DIY pros.",
    cta: "Open an account",
    href: "/login",
  },
  {
    title: "Fit it yourself",
    body: "Step-by-step guides and torque specs for common servicing jobs.",
    cta: "Browse guides",
    href: "/shop",
  },
  {
    title: "Not sure what fits?",
    body: "Use the part-finder to match components to your exact make and model.",
    cta: "Find my part",
    href: "#part-finder",
  },
];

const reviews = [
  { rating: 5, quote: "Ordered front brake pads at 9am, fitted them the next day. Perfect match for my Focus.", author: "Dan R.", vehicle: "Ford Focus" },
  { rating: 5, quote: "Trade prices without a trade account faff. This is my go-to for servicing parts now.", author: "Priya M.", vehicle: "VW Golf" },
  { rating: 4, quote: "Great range and the part-finder made it easy to get the right filter first time.", author: "Steve H.", vehicle: "BMW 3 Series" },
  { rating: 5, quote: "Battery arrived well packaged and fully charged. Cheaper than my local factor too.", author: "Aisha K.", vehicle: "Nissan Qashqai" },
  { rating: 5, quote: "Wiper blades, oil and a pollen filter in one order, all next day. Can't fault it.", author: "Tom B.", vehicle: "Vauxhall Corsa" },
];

const faqs = [
  { question: "How long does delivery take?", answer: "Stocked lines are dispatched the next working day, with free UK delivery on orders over £50." },
  { question: "How do I know a part fits my car?", answer: "Use the part-finder at the top of the page to match components to your make and model, or check the fitment details on each product page." },
  { question: "What's your returns policy?", answer: "Unused parts can be returned within 30 days for a full refund. Fitted or damaged parts may not be eligible." },
  { question: "Are the parts covered by a warranty?", answer: "Yes — every part comes with a minimum 12-month warranty, and some carry longer manufacturer guarantees." },
  { question: "Can I open a trade account?", answer: "Absolutely. Trade accounts unlock bulk pricing for workshops and DIY pros — sign in to get started." },
];

// Featured = top-rated lines, shown in the carousel.
const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);

const categoryCounts = categories
  .filter((c) => c !== "All")
  .map((c) => ({ name: c, count: products.filter((p) => p.category === c).length }));

export default function Home() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <Navigation currentPage="home" showCart={!!user} user={user} />

      {/* ── Hero + part finder ── */}
      <section id="part-finder" className="relative bg-dot-grid overflow-hidden" style={{ borderBottom: "1px solid var(--edge)" }}>
        <Image
          src="/parts-images/hero.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, var(--bg-base) 0%, rgba(15,15,15,0.82) 45%, rgba(15,15,15,0.55) 100%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="max-w-2xl anim-fade-up">
            <p className="font-code text-xs tracking-widest uppercase mb-5" style={{ color: "var(--accent)" }}>
              {user ? `Welcome back, ${user.name}` : "Quality car parts, delivered"}
            </p>
            <h1 className="font-display text-5xl lg:text-6xl leading-[1.05] mb-6" style={{ color: "var(--text-1)" }}>
              The right part.<br />Every time.
            </h1>
            <p className="text-lg mb-10" style={{ color: "var(--text-2)" }}>
              Brakes, filters, electrical, engine, suspension and exterior parts for every make
              and model — at trade prices.
            </p>
          </div>
          <div className="anim-fade-up anim-d2">
            <PartFinder />
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section style={{ borderBottom: "1px solid var(--edge)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span style={{ color: "var(--accent)" }}>
                  <Icon name={item.icon} size={26} />
                </span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{item.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured parts carousel ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-code text-xs tracking-widest uppercase mb-2" style={{ color: "var(--accent)" }}>
                Top rated
              </p>
              <h2 className="font-display text-3xl lg:text-4xl" style={{ color: "var(--text-1)" }}>
                Featured parts
              </h2>
            </div>
            <Link href="/shop" className="btn-ghost hidden sm:inline-flex">
              View all
            </Link>
          </div>

          <Carousel ariaLabel="Featured parts" autoPlayMs={0}>
            {featured.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="card overflow-hidden block h-full"
              >
                <div className="relative h-40" style={{ background: "var(--bg-overlay)" }}>
                  <Image src={item.image} alt={item.title} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="p-4">
                  <p className="font-code text-xs uppercase tracking-wider mb-1.5" style={{ color: "var(--accent)" }}>
                    {item.category}
                  </p>
                  <h3 className="text-sm font-semibold leading-snug mb-3 line-clamp-2" style={{ color: "var(--text-1)" }}>
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-semibold" style={{ color: "var(--accent)" }}>
                      £{item.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-code" style={{ color: "var(--text-3)" }}>★ {item.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </section>

      {/* ── Image carousel ── */}
      <section className="py-16" style={{ borderTop: "1px solid var(--edge)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl lg:text-4xl mb-8" style={{ color: "var(--text-1)" }}>
            Popular parts
          </h2>
          <ImageCarousel
            images={[
              "/parts-images/brakepads.webp",
              "/parts-images/oilfilter.webp",
              "/parts-images/battery.webp",
            ]}
            alt="Popular car parts"
            showIndicators
          />
        </div>
      </section>

      {/* ── Browse by category ── */}
      <section className="py-16" style={{ borderTop: "1px solid var(--edge)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl lg:text-4xl mb-8" style={{ color: "var(--text-1)" }}>
            Browse by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryCounts.map(({ name, count }) => (
              <Link
                key={name}
                href="/shop"
                className="card overflow-hidden flex flex-col hover-border-accent"
              >
                <div className="relative aspect-square" style={{ background: "var(--bg-overlay)" }}>
                  <Image
                    src={categoryImages[name]}
                    alt={name}
                    fill
                    sizes="(min-width:1024px) 16vw, (min-width:768px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3 text-center">
                  <span className="text-sm font-semibold block" style={{ color: "var(--text-1)" }}>{name}</span>
                  <span className="text-xs font-code" style={{ color: "var(--text-3)" }}>{count} parts</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promo tiles ── */}
      <section className="py-16" style={{ borderTop: "1px solid var(--edge)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {promoTiles.map((tile) => (
              <div key={tile.title} className="card p-8 flex flex-col">
                <h3 className="font-display text-xl mb-3" style={{ color: "var(--text-1)" }}>{tile.title}</h3>
                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "var(--text-2)" }}>{tile.body}</p>
                <Link href={tile.href} className="btn-ghost self-start">{tile.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews carousel ── */}
      <section className="py-16" style={{ borderTop: "1px solid var(--edge)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="font-code text-xs tracking-widest uppercase mb-2" style={{ color: "var(--accent)" }}>
              Trusted by drivers
            </p>
            <h2 className="font-display text-3xl lg:text-4xl" style={{ color: "var(--text-1)" }}>
              What our customers say
            </h2>
          </div>

          <Carousel ariaLabel="Customer reviews" autoPlayMs={6000}>
            {reviews.map((review, i) => (
              <figure key={i} className="card p-6 h-full flex flex-col">
                <div className="mb-3" aria-label={`${review.rating} out of 5 stars`}>
                  <span aria-hidden="true" style={{ color: "var(--accent)" }}>
                    {"★".repeat(review.rating)}
                  </span>
                  <span aria-hidden="true" style={{ color: "var(--edge-mid)" }}>
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>
                <blockquote className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-2)" }}>
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-4 pt-4" style={{ borderTop: "1px solid var(--edge)" }}>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{review.author}</span>
                  <span className="text-xs font-code block" style={{ color: "var(--text-3)" }}>{review.vehicle}</span>
                </figcaption>
              </figure>
            ))}
          </Carousel>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16" style={{ borderTop: "1px solid var(--edge)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl lg:text-4xl mb-8" style={{ color: "var(--text-1)" }}>
            Frequently asked questions
          </h2>
          <Accordion items={faqs} />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid var(--edge)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <p className="font-code text-xs uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>Shop</p>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-2)" }}>
                <li><Link href="/shop" className="hover-accent">All parts</Link></li>
                <li><Link href="/shop" className="hover-accent">Categories</Link></li>
                <li><Link href="/cart" className="hover-accent">Basket</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-code text-xs uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>Account</p>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-2)" }}>
                <li><Link href="/login" className="hover-accent">Sign in</Link></li>
                <li><Link href="/dashboard" className="hover-accent">My orders</Link></li>
                <li><Link href="/account" className="hover-accent">My account</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-code text-xs uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>Help</p>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-2)" }}>
                <li><span>Delivery &amp; returns</span></li>
                <li><span>Warranty</span></li>
                <li><span>Contact us</span></li>
              </ul>
            </div>
            <div>
              <p className="font-code text-xs uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>MCR Autos</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                Quality car parts at trade prices, dispatched next working day across the UK.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-6" style={{ borderTop: "1px solid var(--edge)" }}>
            <span className="font-code text-xs" style={{ color: "var(--text-3)" }}>🔧 MCR AUTOS</span>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>Quality car parts · Fast UK delivery</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
