'use client';

import { useState, type ReactNode } from "react";

export interface AccordionItem {
  question: string;
  answer: ReactNode;
}

/**
 * Reusable single-open accordion (FAQ-style). Opening one panel closes the rest.
 */
export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y" style={{ borderColor: "var(--edge)" }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `accordion-panel-${i}`;
        const buttonId = `accordion-button-${i}`;
        return (
          <div key={i} style={{ borderColor: "var(--edge)" }}>
            <h3>
              <button
                id={buttonId}
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex items-center justify-between gap-4 py-5 text-left transition-colors"
                style={{ color: "var(--text-1)" }}
              >
                <span className="font-semibold">{item.question}</span>
                <span
                  aria-hidden="true"
                  className="text-xl flex-shrink-0 transition-transform duration-200"
                  style={{ color: "var(--accent)", transform: isOpen ? "rotate(45deg)" : "none" }}
                >
                  +
                </span>
              </button>
            </h3>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="pb-5 text-sm leading-relaxed anim-fade-in"
                style={{ color: "var(--text-2)" }}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
