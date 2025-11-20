import React, { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "../ThemeContext"; 

export const ToggleTheme = ({
  duration = 700,
  animationType = "circle-spread",
  style,
  className
}) => {
  const { theme, toggleTheme: contextToggleTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme === 'dark');
  const buttonRef = useRef(null);

  useEffect(() => {
    setIsDark(theme === 'dark');
  }, [theme]);

  const handleToggle = useCallback(async () => {
    if (!buttonRef.current) return;

    if (!document.startViewTransition) {
      contextToggleTheme();
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        contextToggleTheme();
      });
    }).ready;

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    if (animationType === "circle-spread") {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    }
  }, [contextToggleTheme, duration, animationType]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`toggle-theme-btn ${className || ''}`} 
        style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...style
        }}
        aria-label="Toggle Theme"
      >
        {isDark ? (
            // Sun Icon (Yellow for visibility)
            <Sun className="h-6 w-6" color="#fdb813" />
        ) : (
            // FIX: Changed from var(--nav-text) to var(--text) to match your CSS
            <Moon className="h-6 w-6" color="var(--text)" />
        )}
      </button>

      <style>
        {`
          ::view-transition-old(root),
          ::view-transition-new(root) {
            animation: none;
            mix-blend-mode: normal;
          }
          ::view-transition-new(root) {
            z-index: 9999;
          }
          ::view-transition-old(root) {
             z-index: 1;
          }
          /* Pure Black background for the transition circle */
          .dark::view-transition-new(root) {
            background-color: #000000; 
          }
          :root:not(.dark)::view-transition-new(root) {
            background-color: #ffffff;
          }
        `}
      </style>
    </>
  );
};