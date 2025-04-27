import React, { PropsWithChildren, useEffect } from 'react';
import RNErrorBoundary from 'react-native-error-boundary';
import { Box } from './box';
import { Text } from './text';
import { useTheme } from '@/shared/contexts/themeContext';
import { Button } from './button';
import { spacing } from '@/shared/theme';
import Monicon from '@monicon/native';
import useScreenDimensions from '@/shared/hooks/useScreenDimensions';

const ErrorFallbackComponent = (props: {
  error: Error;
  resetError: TFunction;
}) => {
  const { error, resetError } = props;
  const { themeColors } = useTheme();
  const { screenWidth } = useScreenDimensions();

  useEffect(() => {
    // Logging error here
    console.log(error);
  }, [error]);

  return (
    <Box flex center px={spacing.scale(15)} bg={'#000000'}>
      <Monicon name="nrk:404" size={screenWidth / 2} color="#FFFFFF" />
      <Box mt={15} gap={3}>
        <Text fontFamily={Text.fonts.inter.medium}>
          Đã có lỗi xảy ra. Vui lòng báo cho nhà phát triển
        </Text>
        <Text size={12} mt={8} color="#9f9fa2">
          {`${error.name}`}
        </Text>
        <Text size={12} color="#9f9fa2">
          {`${error.message}`}
        </Text>
      </Box>
      <Button
        variant={Button.Variants.GHOST}
        mt={20}
        alignSelf="center"
        onPress={() => resetError()}
      >
        <Text color="#1f6efc">Khởi động lại</Text>
      </Button>
    </Box>
  );
};

const ErrorBoundary = ({ children }: PropsWithChildren) => {
  return (
    <RNErrorBoundary FallbackComponent={ErrorFallbackComponent}>
      <React.Fragment>{children}</React.Fragment>
    </RNErrorBoundary>
  );
};

export default ErrorBoundary;
