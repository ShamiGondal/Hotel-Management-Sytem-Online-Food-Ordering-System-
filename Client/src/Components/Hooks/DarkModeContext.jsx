import { createContext, useContext, useState } from 'react';

// Create a context for managing dark and light mode
const DarkModeContext = createContext();

// Custom hook for consuming the dark mode context
export const useDarkMode = () => useContext(DarkModeContext);

// Context provider component
export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDrawerDarkMode, setIsDrawerDarkMode] = useState(false);

  // Function to toggle dark mode state
  const toggleDarkMode = () => {
    setIsDarkMode(prevState => !prevState);
    setIsDrawerDarkMode(prevState => !prevState); // Toggle drawer dark mode
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode ,  isDrawerDarkMode, setIsDrawerDarkMode}}>
      {children}
    </DarkModeContext.Provider>
  );
};
