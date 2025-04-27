import { StyleSheet } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetFlashList,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { Text } from '@/components/text';
import { Box } from '@/components/box';
import { ServerDatum } from '@/types/models/movie';
import { Touchable } from '@/components/button';
import Monicon from '@monicon/native';
import { removeVietnameseTones } from '@/shared/utils/common';
import { usePlayer } from '@/shared/contexts/playerContext';

interface Props {
  sheetRef: React.RefObject<BottomSheetModal>;
  data: ServerDatum[];
  movieTitle: string;
}

const AllEpisodeBottomSheet = ({ sheetRef, data, movieTitle }: Props) => {
  const { openPlayer } = usePlayer();

  const snapPoints = useMemo(() => ['50%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setTextSearch('');
    }
  }, []);

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const [textSearch, setTextSearch] = useState('');

  const searchData = useMemo(() => {
    if (!textSearch.length) return data;

    const normalizedSearchText = removeVietnameseTones(textSearch);

    return data.filter((item) =>
      removeVietnameseTones(item.name).includes(normalizedSearchText),
    );
  }, [textSearch, data]);

  const renderItem = useCallback(
    ({ item, index }: { item: ServerDatum; index: number }) => {
      return (
        <Touchable.Animated
          onPress={() => {
            handleClosePress();

            setTimeout(() => {
              openPlayer({
                title: movieTitle,
                episodes: data,
                selectedIndex:
                  data.findIndex((episode) => episode.slug === item.slug) || 0,
              });
            }, 0);
          }}
          // entering={FadeIn.delay(50 * index)}
          key={`${item.slug}-${index}`}
          center
          row
          wFull
          gap={15}
        >
          <Box rounded={6} flex wFull aspectRatio={1.78} bg={'#252525'} center>
            <Monicon name="ri:play-large-fill" color="#FFF" size={22} />
          </Box>
          <Box flex={2} gap={5}>
            <Text size={14} fontFamily={Text.fonts.inter.medium}>
              {item.name}
            </Text>
            <Text size={12} color="#747474">
              Đang cập nhật mô tả...
            </Text>
          </Box>
        </Touchable.Animated>
      );
    },
    [],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableContentPanningGesture={false}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#323434' }}
      handleIndicatorStyle={{ backgroundColor: '#a4a9b2' }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <Box pb={15} center row alignItems="center" gap={10}>
        <Box flex />
        <Box flex={4} center>
          <Text
            numberOfLines={1}
            fontFamily={Text.fonts.inter.medium}
            size={18}
          >
            {movieTitle}
          </Text>
        </Box>
        <Box flex alignItems="flex-end">
          <Touchable
            center
            flex
            onPress={() => sheetRef.current?.close()}
            mr={15}
          >
            <Text
              size={16}
              color="#1f6efc"
              fontFamily={Text.fonts.inter.medium}
            >
              Xong
            </Text>
          </Touchable>
        </Box>
      </Box>
      <Box px={8} gap={8} mb={15}>
        <BottomSheetTextInput
          style={{
            backgroundColor: '#565959',
            borderRadius: 1000,
            paddingHorizontal: 14,
            paddingVertical: 8,
            fontSize: 15,
            color: '#FFF',
          }}
          value={textSearch}
          onChangeText={setTextSearch}
          placeholder="Tìm kiếm tập phim..."
          placeholderTextColor={'#dbdbdb'}
        />
      </Box>
      <BottomSheetFlashList
        data={searchData}
        keyExtractor={(_, index) => `${index}`}
        renderItem={renderItem}
        estimatedItemSize={78}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 30 }}
        ItemSeparatorComponent={() => <Box h={10} />}
      />
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
  itemContainer: {
    // padding: 6,
    // margin: 6,
    backgroundColor: '#eee',
  },
});

export default AllEpisodeBottomSheet;
