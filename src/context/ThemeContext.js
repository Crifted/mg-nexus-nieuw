// src/context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('mg-nexus-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setIsLoaded(true);
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme || (theme === 'dark' ? 'light' : 'dark'));
    localStorage.setItem('mg-nexus-theme', newTheme || (theme === 'dark' ? 'light' : 'dark'));
  };

  // Define theme colors
  const themes = {
    dark: {
      primary: '#60a5fa', // blue-400
      secondary: '#374151', // gray-700
      background: 'from-gray-900 via-gray-800 to-black',
      text: 'text-white',
      card: 'bg-gray-700',
      input: 'bg-gray-700',
      border: 'border-gray-600',
    },
    light: {
      primary: '#3b82f6', // blue-500
      secondary: '#f3f4f6', // gray-100
      background: 'from-blue-50 via-white to-blue-50',
      text: 'text-gray-800',
      card: 'bg-white',
      input: 'bg-white',
      border: 'border-gray-300',
    },
    modern: {
      primary: '#8b5cf6', // violet-500
      secondary: '#1f2937', // gray-800
      background: 'from-gray-900 via-indigo-900 to-gray-900',
      text: 'text-white',
      card: 'bg-gray-800',
      input: 'bg-gray-800',
      border: 'border-indigo-700',
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themes, currentTheme: themes[theme], isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};