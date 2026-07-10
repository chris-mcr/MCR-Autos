'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { makes, modelsFor } from "@/lib/vehicles";

/**
 * Vehicle part-finder hero panel (AutoTrader-style search box).
 * Dependent make/model dropdowns. On submit it stores the chosen
 * vehicle in localStorage and routes to the shop.
 *
 * ponytail: the shop doesn't yet filter by stored vehicle — that's a good
 * attendee task. See localStorage key "vehicle".
 */
export default function PartFinder() {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [error, setError] = useState("");

  const models = make ? modelsFor(make) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make) {
      setError("Please select a make to find parts.");
      return;
    }
    setError("");
    localStorage.setItem("vehicle", JSON.stringify({ make, model }));
    router.push("/shop");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-6 sm:p-8"
      aria-label="Find parts for your vehicle"
    >
      <p className="font-code text-xs tracking-widest uppercase mb-5" style={{ color: "var(--accent)" }}>
        Find your part
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="finder-make" className="block text-xs font-code uppercase tracking-wide mb-2" style={{ color: "var(--text-3)" }}>
            Make
          </label>
          <select
            id="finder-make"
            value={make}
            onChange={(e) => {
              setMake(e.target.value);
              setModel("");
              setError("");
            }}
            className="field"
            aria-label="Vehicle make"
          >
            <option value="">Any make</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="finder-model" className="block text-xs font-code uppercase tracking-wide mb-2" style={{ color: "var(--text-3)" }}>
            Model
          </label>
          <select
            id="finder-model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!make}
            className="field disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Vehicle model"
          >
            <option value="">{make ? "Any model" : "Select make first"}</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button type="submit" className="btn-amber w-full">
            Find parts
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm mt-4" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </form>
  );
}
