import { Box } from '@/components/box';
import { Touchable } from '@/components/button';
import { Text } from '@/components/text';
import TurboImage from '@/components/TurboImage';
import { SCREEN_NAME } from '@/config';
import UrlManager from '@/libs/url-manager';
import { isValidURL } from '@/shared/utils/common';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import { MovieBanner, MovieCommon } from '@/types/models/movie';
import React from 'react';

interface Props {
  item: MovieCommon | MovieBanner;
}

const SearchItem = ({ item }: Props) => {
  return (
    <Touchable.Animated
      // entering={FadeIn.delay(50 * index)}
      onPress={() =>
        navigationHelper.navigate(SCREEN_NAME.Detail, {
          _id: item._id,
          slug: item.slug,
          thumb: isValidURL(item.thumb_url)
            ? item.thumb_url
            : UrlManager._APP_CDN_IMG_DOMAIN + item.thumb_url,
          // description: item.description,
        })
      }
    >
      <Box flex row gap={12}>
        <Box flex={1} py={8}>
          <Box wFull ratio={1.78}>
            <TurboImage
              $wrapperProps={{ flex: 1 }}
              source={{
                uri: isValidURL(item.thumb_url)
                  ? item.thumb_url
                  : UrlManager._APP_CDN_IMG_DOMAIN + item.thumb_url,
              }}
              rounded={6}
            />
          </Box>
        </Box>
        <Box
          justifyContent="center"
          flex={2}
          py={8}
          borderBottomWidth={1}
          borderBottomColor={'#3d3d3f'}
          gap={1}
        >
          <Text
            size={13}
            numberOfLines={2}
            fontFamily={Text.fonts.inter.medium}
          >
            {item.name}
          </Text>
          <Text color="#747474" mt={3} size={12} numberOfLines={1}>
            {item.origin_name}
          </Text>
        </Box>
      </Box>
    </Touchable.Animated>
  );
};

export default SearchItem;
