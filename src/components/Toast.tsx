import React from 'react';
import { toast } from 'sonner-native';
import { Box } from './box';
import { BlurView } from '@react-native-community/blur';
import { StyleSheet } from 'react-native';
import Monicon from '@monicon/native';
import { Text } from './text';
import { uniqueId } from 'lodash';

export function showToast({
  msg,
  icon,
  $right,
}: {
  msg: string;
  icon?: string;
  $right?: (_toast: typeof toast, _toastId: string) => React.ReactNode;
}) {
  const toastId = uniqueId();

  toast.custom(
    <Box px={15}>
      <Box py={12} px={10} rounded={6} overflow="hidden">
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={15}
          reducedTransparencyFallbackColor="white"
        />

        <Box row justifyContent="space-between">
          <Box row alignItems="center" gap={10}>
            {icon && <Monicon name={icon} size={24} color="#FFF" />}
            <Text>{msg}</Text>
          </Box>
          {$right && $right(toast, toastId)}
        </Box>
      </Box>
    </Box>,
    { id: toastId },
  );
}
