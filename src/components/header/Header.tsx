import React from 'react';
import { Box } from '../box';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/contexts/themeContext';
import { IconSvg } from '../icon-svg/IconSvg';
import R from '@/assets';
import { Text } from '../text';
import { spacing } from '@/shared/theme';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import { HeaderProps } from './Header.type';

const Header = (props: HeaderProps) => {
  const { top } = useSafeAreaInsets();
  const { themeColors } = useTheme();

  const {
    customHeader,
    left,
    right,
    name,
    color = themeColors.background.primary,
  } = props;

  return (
    <Box backgroundColor={color}>
      <Box height={top} />
      {customHeader ? (
        customHeader
      ) : (
        <Box.Row bg={themeColors.background.primary} py={10} px={15}>
          <Box flex gap={spacing.sm} alignItems="flex-start">
            {left ? (
              left
            ) : (
              <IconSvg
                onPress={() => navigationHelper.goBack()}
                source={R.icons.ic_arrow_left}
              />
            )}
          </Box>
          {!!name?.length && (
            <Box flex={2} center>
              <Text size={18} numberOfLines={1}>
                {name}
              </Text>
            </Box>
          )}
          <Box flex={1} alignItems="flex-end">
            {right}
          </Box>
        </Box.Row>
      )}
    </Box>
  );
};

export default Header;
