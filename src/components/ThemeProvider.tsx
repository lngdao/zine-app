import React, { PropsWithChildren, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { STORAGE_THEME } from '@/config';
import { getItem, setItem } from '@/libs/storage';
import { ThemeContext } from '@/shared/contexts/themeContext';
import { useEffectOnce } from '@/shared/hooks/useEffectOnce';
import { palettes as definedColors, TTheme } from '@/shared/theme/colors';

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const defaultTheme = Object.keys(definedColors)[0] as TTheme;
  const scheme = useColorScheme();

  const [theme, setTheme] = useState<TTheme>(defaultTheme);
  const colors = useMemo(() => definedColors[theme], [theme]);

  const changeTheme = (_theme: TTheme) => {
    setItem(STORAGE_THEME, _theme);
    setTheme(_theme);
  };

  useEffectOnce(() => {
    let _theme = defaultTheme;
    const savedTheme = getItem<TTheme>(STORAGE_THEME);
    if (savedTheme) {
      _theme = savedTheme;
    } else if (scheme && scheme in colors) {
      _theme = scheme;
    }

    setItem(STORAGE_THEME, _theme);
    setTheme(_theme);
  });

  const contextValue = {
    currentTheme: theme,
    themes: Object.keys(definedColors) as TTheme[],
    themeColors: colors,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
