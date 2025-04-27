import React from 'react';

interface WebViewContextProps {
  url: string | null;
  openPlayer: (url: string) => void;
  closePlayer: () => void;
}

const defaultContextValue: WebViewContextProps = {
  url: null,
  openPlayer: () => {},
  closePlayer: () => {},
};

export const WebViewContext =
  React.createContext<WebViewContextProps>(defaultContextValue);

export const useWebViewPlayer = () => React.useContext(WebViewContext);
