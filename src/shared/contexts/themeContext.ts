import React from 'react';
import { TColor, TTheme } from '../theme/colors';

interface ThemeContextProps {
  themes: TTheme[];
  currentTheme: TTheme;
  themeColors: TColor;
  changeTheme: (colors: TTheme) => void;
}

const defaultContextValue: ThemeContextProps = {
  themes: [],
  currentTheme: '' as TTheme,
  themeColors: {} as TColor,
  changeTheme: () => {},
};

export const ThemeContext =
  React.createContext<ThemeContextProps>(defaultContextValue);

export const useTheme = () => React.useContext(ThemeContext);
