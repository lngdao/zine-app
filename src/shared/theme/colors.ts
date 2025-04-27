export const colors = {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'rgba(0,0,0,0)',
};

export const palettes = {
  light: {
    theme: {
      primary: '#FFFFFF',
      secondary: '#007AFF',
      opposite: '#000000',
      neutral: '#808080',
      accent: '#FFD700',
    },
    overlay: 'rgba(255, 255, 255, 0.8)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    border: '#D1D1D1',
    text: {
      primary: '#000000',
      secondary: '#444444',
      dim: '#999999',
    },
    button: {
      primary: '#007AFF',
      accent: '#C4E1FF',
      neutral: '#808080',
      danger: '#FF0000',
      content: '#FFFFFF',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F2F2F2',
      neutral: '#E5E5E5',
    },
    state: {
      error: '#FF0000',
      success: '#00FF00',
      disabled: '#CCCCCC',
      active: '#007AFF',
      inactive: '#B2B2B2',
    },
    placeholder: '#B2B2B2',
    separator: '#D1D1D1',
  },

  dark: {
    theme: {
      primary: '#000000',
      secondary: '#007AFF',
      opposite: '#FFFFFF',
      neutral: '#A9A9A9',
      accent: '#FFFF00',
      danger: '#FF0000',
    },
    overlay: 'rgba(0, 0, 0, 0.8)',
    backdrop: 'rgba(255, 255, 255, 0.5)',
    border: '#5C5C5C',
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      dim: '#999999',
    },
    button: {
      primary: '#007AFF',
      accent: '#4D71A3',
      neutral: '#A9A9A9',
      danger: '#FF0000',
      content: '#FFFFFF',
    },
    background: {
      primary: '#1E1E1E',
      secondary: '#2E2E2E',
      neutral: '#333333',
    },
    state: {
      error: '#FF3333',
      success: '#33FF33',
      disabled: '#666666',
      active: '#0080FF',
      inactive: '#999999',
    },
    placeholder: '#999999',
    separator: '#5C5C5C',
  },
};

const colorValues = Object.values(palettes)[0];

export type TTheme = keyof typeof palettes;
export type TColor = typeof colorValues;
