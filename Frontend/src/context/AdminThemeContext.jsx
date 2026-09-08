import React, { createContext, useState, useEffect } from 'react';

// Common brand tokens that don't change with theme
const shared = {
  stone400: '#a49a84',
  stone500: '#857b67',
  stone600: '#6b6250',
  brass300: '#dcc08a',
  brass400: '#c6a462',
  brass500: '#a5844a',
  em300: '#8fc0a8',
  em500: '#2c8360',
  em600: '#1e6b4c',
  em700: '#1a4d38',
  rose400: '#c87f63',
};

// Dark theme palette
const darkTheme = {
  ...shared,
  theme: 'dark',
  ink950: '#0c0b09',   // Main background
  ink900: '#14120f',   // Sidebar / secondary bg
  ink800: '#1c1a15',   // Cards / form bg
  ink700: '#262219',   // Nested cards
  lineDark: 'rgba(247,242,232,0.10)',
  ivory50: '#f7f2e8',  // Main text
  ivory100: '#efe8d8', // Secondary text
  // Dashboard-specific
  headerBg: '#14120f',
  sidebarBg: '#14120f',
  cardBg: '#1c1a15',
  cardBorder: 'rgba(247,242,232,0.10)',
  cardShadow: 'none',
  innerCardBg: '#14120f',
};

// Light theme palette
const lightTheme = {
  ...shared,
  theme: 'light',
  ink950: '#f7f2e8',   // Main background (ivory)
  ink900: '#efe8d8',   // Secondary background
  ink800: '#e3d8c0',   // Tertiary (sand)
  ink700: '#c9bb9e',   // Sand 300
  lineDark: 'rgba(12,11,9,0.12)',
  ivory50: '#0c0b09',  // Main text
  ivory100: '#262219', // Secondary text
  // Dashboard-specific — key improvements
  headerBg: '#ffffff',                         // White header
  sidebarBg: '#e3d8c0',                        // Sand sidebar (darker than main)
  cardBg: '#ffffff',                           // White cards float on ivory bg
  cardBorder: 'rgba(12,11,9,0.10)',
  cardShadow: '0 1px 6px rgba(12,11,9,0.07)', // Soft lift shadow
  innerCardBg: '#f7f2e8',                      // Ivory inner cards
};

export const AdminThemeContext = createContext();

export function AdminThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('admin-theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const C = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme, C }}>
      {children}
    </AdminThemeContext.Provider>
  );
}
