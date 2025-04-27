import React, { useCallback, useMemo } from 'react';
import { Box } from '@/components/box';
import { Touchable } from '@/components/button';
import { Text } from '@/components/text';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

interface Props {
  title: string;
  value: string;
  sheetRef: React.RefObject<BottomSheetModal>;
}

const CollapsibleText = ({ value, sheetRef, title }: Props) => {
  const snapPoints = useMemo(() => ['63%'], []);

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

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
      snapPoints={snapPoints}
      enablePanDownToClose
      enableContentPanningGesture={false}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#323434' }}
      handleIndicatorStyle={{ backgroundColor: '#a4a9b2' }}
    >
      <Box pb={15} center row alignItems="center" gap={10}>
        <Box flex />
        <Box flex={4} center>
          <Text
            numberOfLines={1}
            fontFamily={Text.fonts.inter.medium}
            size={18}
          >
            {title}
          </Text>
        </Box>
        <Box flex alignItems="flex-end">
          <Touchable center flex onPress={handleClosePress} mr={15}>
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
      <BottomSheetScrollView
        bounces={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <Text textAlign="justify">{value}</Text>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default CollapsibleText;
