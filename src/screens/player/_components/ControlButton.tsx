import React from 'react';
import { Touchable } from '@/components/button';
import { Box } from '@/components/box';
import Monicon from '@monicon/native';
import { rgba } from '@/shared/utils/common';

interface Props {
  onPress: () => void;
  icon: string;
  disabled?: boolean;
  size?: number;
  rounded?: number | 'full';
}

const ControlButton = ({
  onPress,
  icon,
  disabled,
  size = 20,
  rounded = 10,
}: Props) => {
  return (
    <Touchable disabled={disabled} onPress={onPress}>
      <Box p={6} bg={rgba('#FFFFFF', 0.2)} rounded={rounded}>
        <Monicon
          name={icon}
          size={size}
          color={disabled ? '#747474' : '#FFF'}
        />
      </Box>
    </Touchable>
  );
};

export default ControlButton;
