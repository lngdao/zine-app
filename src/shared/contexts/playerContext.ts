import { Episode, ServerDatum } from '@/types/models/movie';
import React from 'react';

interface PlayerContextProps {
  // url: string | null;
  useWebViewPlayer: boolean;
  episodes: ServerDatum[];
  movieTitle?: string;
  openPlayer: (data: {
    title?: string;
    episodes: ServerDatum[];
    selectedIndex: number;
  }) => void;
  closePlayer: () => void;
  toggleUseWebViewPlayer: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultContextValue: PlayerContextProps = {
  useWebViewPlayer: true,
  episodes: [],
  movieTitle: '',
  openPlayer: () => {},
  closePlayer: () => {},
  toggleUseWebViewPlayer: () => {},
};

export const PlayerContext =
  React.createContext<PlayerContextProps>(defaultContextValue);

export const usePlayer = () => React.useContext(PlayerContext);
