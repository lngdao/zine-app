import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal } from 'react-native';
import { Box } from './box';
import { WebView } from 'react-native-webview';
import { Touchable } from './button';
import { rgba } from '@/shared/utils/common';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import { SCREEN_NAME, STORAGE_USE_WEBPLAYER } from '@/config';
import { PlayerContext } from '@/shared/contexts/playerContext';
import { ServerDatum } from '@/types/models/movie';
import { getItem, setItem } from '@/libs/storage';

const PlayerProvider = ({ children }: PropsWithChildren) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [episodes, setEpisodes] = useState<ServerDatum[]>([]);
  const [useWebViewPlayer, setUserWebViewPlayer] = useState(true);

  const openPlayer = ({
    title = '',
    episodes,
    selectedIndex,
  }: {
    title?: string;
    episodes: ServerDatum[];
    selectedIndex: number;
  }) => {
    // setIsVisible(true);
    setTitle(title);
    setEpisodes(episodes);

    navigationHelper.navigate(SCREEN_NAME.Player, {
      title,
      episodes,
      selectedIndex,
    });
  };

  const closePlayer = () => {
    navigationHelper.goBack();
  };

  const toggleUseWebViewPlayer = () => {
    setUserWebViewPlayer((prev) => {
      const newValue = !prev;
      setItem<string>(STORAGE_USE_WEBPLAYER, newValue ? '1' : '0');

      return newValue;
    });
  };

  useEffect(() => {
    const isUseWebPlayerIfNeed = getItem<string>(STORAGE_USE_WEBPLAYER);

    if (!isUseWebPlayerIfNeed) setItem<string>(STORAGE_USE_WEBPLAYER, '1');
    else {
      setUserWebViewPlayer(Boolean(Number(isUseWebPlayerIfNeed)));
    }
  }, []);

  const contextValue = {
    useWebViewPlayer,
    movieTitle: title,
    episodes,
    openPlayer,
    closePlayer,
    toggleUseWebViewPlayer,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closePlayer}
      >
        <Box flex>
          {url && (
            <WebView
              source={{ uri: url }}
              style={{ flex: 1 }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo={true}
              onError={(e) => console.log('Error:', e)}
            />
          )}
          <Touchable
            onPress={closePlayer}
            absolute
            top={15}
            left={15}
            alignSelf="flex-end"
            bg={rgba('#181818', 0.6)}
            p={8}
            rounded={'full'}
          >
            {/* <X fill={'white'} color={'white'} size={20} /> */}
          </Touchable>
        </Box>
      </Modal>
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
