"use client";

import { useState, useCallback } from "react";

interface ProductFact {
  question: string;
  answer: string;
}

interface ProductFactsProps {
  facts: ProductFact[];
  title?: string;
}

/**
 * Accordion-style product facts section.
 * Each fact is a Q&A pair that expands/collapses on click.
 */
export function ProductFacts({ facts, title = "Product Facts" }: ProductFactsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = useCallback((idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  }, []);

  if (facts.length === 0) return null;

  return (
    <section className="mt-10">
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 16,
          color: "#111827",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {facts.map((fact, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              style={{
                borderBottom: idx < facts.length - 1 ? "1px solid #e5e7eb" : "none",
              }}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111827",
                  background: isOpen ? "#f9fafb" : "#fff",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: 12,
                  transition: "background 0.15s",
                }}
              >
                <span style={{ flex: 1 }}>{fact.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    flexShrink: 0,
                    color: "#9ca3af",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {isOpen && (
                <div
                  style={{
                    padding: "0 16px 14px",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "#4b5563",
                    background: "#f9fafb",
                  }}
                >
                  {fact.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
