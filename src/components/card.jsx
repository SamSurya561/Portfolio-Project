// src/components/card.jsx
import React from "react";

/**
 * Minimal Card + CardContent wrapper
 * Works perfectly with the ScrollTimeline component.
 */

export function Card({ children, className = "", ...rest }) {
  return (
    <div
      className={["rounded-xl bg-white border border-gray-100 shadow-sm", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...rest }) {
  return (
    <div className={["p-4", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}
