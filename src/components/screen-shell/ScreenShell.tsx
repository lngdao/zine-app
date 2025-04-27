/**
 * This component should use for wrap your screen
 * You can implement the loading, error, offline, no data,... depending on your purpose
 */

import React, { PropsWithChildren } from 'react';
import { useNetworkContext } from '@/shared/contexts/networkContext';
import { Box } from '../box';
import { Platform, ScrollViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/contexts/themeContext';
import OfflineStatus from '../offline-status';
import { ScreenShellProps } from './ScreenShell.type';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const ScreenShell = <T extends boolean = true>(
  props: PropsWithChildren<ScreenShellProps<T>>,
) => {
  const { bottom } = useSafeAreaInsets();
  const { themeColors } = useTheme();
  const { isOffline } = useNetworkContext();

  const defaultScrollComponentProps: ScrollViewProps = {
    keyboardShouldPersistTaps: 'handled',
    style: styles.scrollView,
    contentInset: { bottom },
    contentInsetAdjustmentBehavior: 'automatic',
  };

  const {
    children,
    header,
    // bgColor = themeColors.background.primary,
    // bgColor = '#121212',
    bgColor = '#000',
    scrollable = true,
    renderScrollComponent,
    // error,
    // loading,
    // noData,
    $wrapperProps,
    $containerProps,
  } = props;

  const renderScrollable = renderScrollComponent ? (
    renderScrollComponent({
      ...defaultScrollComponentProps,
      children: Array.isArray(children) ? <>{children}</> : children,
    })
  ) : (
    <KeyboardAwareScrollView
      bottomOffset={15}
      {...defaultScrollComponentProps}
      {...$containerProps}
    >
      {children}
    </KeyboardAwareScrollView>
  );

  return (
    <Box flex bg={bgColor} {...$wrapperProps}>
      {header && header}
      {scrollable ? (
        renderScrollable
      ) : (
        <Box flex {...$containerProps}>
          {children}
        </Box>
      )}
      {/* {isOffline && <OfflineStatus />} */}
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

export default ScreenShell;
