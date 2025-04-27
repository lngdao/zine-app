import React, { useEffect, useMemo, useState } from 'react';
import { Episode, ServerDatum } from '@/types/models/movie';
import { Box } from '@/components/box';
import { Touchable } from '@/components/button';
import { Text } from '@/components/text';
import Monicon from '@monicon/native';
import { ScrollView } from 'react-native';
import { usePlayer } from '@/shared/contexts/playerContext';
import ServerSelectMenu from './ServerSelectMenu';
import useScreenDimensions from '@/shared/hooks/useScreenDimensions';
import { useScreenOrientation } from '@/shared/hooks/useScreenOrientation';

interface Props {
  episodeData: Episode[];
  title: string;
  onEpisodeDataChange: (episodes: ServerDatum[]) => void;
  handleOpenFullListEpisode: () => void;
}

const ListEpisode = ({
  title,
  episodeData,
  onEpisodeDataChange,
  handleOpenFullListEpisode,
}: Props) => {
  const { screenWidth } = useScreenDimensions();
  const { isLandscape } = useScreenOrientation();
  const { openPlayer } = usePlayer();

  const [currentServer, setCurrentServer] = useState(0);

  const servers = useMemo(() => {
    if (episodeData && episodeData.length) {
      return episodeData.map((server) => server.server_name);
    }

    return [];
  }, [episodeData]);

  const episodes = useMemo(() => {
    if (episodeData && episodeData.length) {
      return episodeData[currentServer].server_data;
    }

    return [];
  }, [episodeData, servers, currentServer]);

  useEffect(() => {
    onEpisodeDataChange(episodes);
  }, [episodes]);

  const renderEpisodeItem = (episode: ServerDatum, index: number) => {
    return (
      <Touchable.Animated
        onPress={() => openPlayer({ title, episodes, selectedIndex: index })}
        key={`${episode.slug}-${index}`}
      >
        <Box gap={12} center w={isLandscape ? 210 : screenWidth / 2.3}>
          <Box rounded={6} wFull aspectRatio={1.78} bg={'#252525'} center>
            <Monicon name="ri:play-large-fill" color="#FFF" size={28} />
          </Box>
          <Box gap={5} wFull>
            <Text
              size={14}
              fontFamily={Text.fonts.inter.medium}
              flex={1}
              numberOfLines={1}
            >
              {episode.name}
            </Text>
            <Text size={12} color="#747474">
              Đang cập nhật mô tả...
            </Text>
          </Box>
        </Box>
      </Touchable.Animated>
    );
  };

  return (
    <>
      <Box mt={15}>
        <Box px={15} alignItems="flex-start">
          <ServerSelectMenu
            activeIndex={currentServer}
            servers={episodeData}
            onServerSelect={(index) => setCurrentServer(index)}
          />
        </Box>
        <ScrollView
          horizontal
          contentContainerStyle={{
            gap: 10,
            paddingHorizontal: 15,
            alignItems: 'flex-start',
          }}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12 }}
        >
          {episodes.length > 5
            ? episodes
                .slice(0, 5)
                .map((episode, index) => renderEpisodeItem(episode, index))
            : episodes.map((episode, index) =>
                renderEpisodeItem(episode, index),
              )}
          {episodes.length > 5 && (
            <Touchable.Animated
              onPress={handleOpenFullListEpisode}
              center
              gap={15}
            >
              <Box
                rounded={6}
                w={isLandscape ? 210 : screenWidth / 2.3}
                aspectRatio={1.78}
                bg={'#252525'}
                center
              >
                <Text
                  color="#dbdbdb"
                  fontFamily={Text.fonts.inter.medium}
                  size={18}
                >{`+${episodes.length - 5}`}</Text>
              </Box>
              <Box wFull gap={5}>
                <Text size={14} fontFamily={Text.fonts.inter.medium}>
                  Hiển thị tất cả
                </Text>
              </Box>
            </Touchable.Animated>
          )}
        </ScrollView>
      </Box>
    </>
  );
};

export default ListEpisode;
