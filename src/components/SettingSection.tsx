import React, { PropsWithChildren } from 'react';
import { Box, BoxProps } from '@/components/box';
import { Touchable, TouchableProps } from '@/components/button';
import { Text } from '@/components/text';
import Monicon from '@monicon/native';

interface SettingGroupProps extends PropsWithChildren {
  groupTitle?: string;
  groupDescription?: string;
  $groupWrapperProps?: BoxProps;
}

interface SettingItemProps {
  readOnly?: boolean;
  title: string;
  subTitle?: string;
  addTitle?: string;
  showRightIcon?: boolean;
  showSeparate?: boolean;
  isDanger?: boolean;
  _renderRight?: React.ReactNode;
  onPress?: () => void;
  $touchableProps?: TouchableProps;
}

const SettingGroup = ({
  children,
  groupTitle,
  groupDescription,
  $groupWrapperProps,
}: SettingGroupProps) => {
  return (
    <Box>
      {groupTitle && (
        <Text
          size={11}
          mb={7}
          ml={12}
          color="#dbdbdb"
          fontFamily={Text.fonts.inter.medium}
        >
          {groupTitle}
        </Text>
      )}
      <Box rounded={8} overflow="hidden" {...$groupWrapperProps}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const allowShowSeparate = () => {
              const isChildList = Array.isArray(children);

              if (isChildList) return index !== Array.from(children).length - 1;
              return false;
            };

            return React.cloneElement(child, {
              ...child.props,
              $touchableProps: { rounded: 0 },
              showSeparate: allowShowSeparate(),
            });
          }
          return child;
        })}
      </Box>
      {groupDescription && (
        <Text size={11} mt={8} ml={12} color="#4c4b4d">
          {groupDescription}
        </Text>
      )}
    </Box>
  );
};

const SettingItem = ({
  readOnly,
  title,
  subTitle,
  addTitle,
  showRightIcon = true,
  showSeparate,
  isDanger,
  _renderRight,
  onPress,
  $touchableProps,
}: SettingItemProps) => {
  const _defaultRenderRight = (() => {
    return subTitle ? (
      <Text size={13} color="#9f9fa2">
        {subTitle}
      </Text>
    ) : (
      <Box row alignItems="center" gap={5}>
        {addTitle && <Text size={13}>{addTitle}</Text>}
        {showRightIcon && (
          <Monicon size={18} name="ri:arrow-right-s-line" color="#9f9fa2" />
        )}
      </Box>
    );
  })();

  return (
    <Touchable
      disabled={readOnly}
      wFull
      borderRadius={8}
      {...$touchableProps}
      onPress={onPress}
    >
      <Box row bg={'#1c1c1e'}>
        <Box pl={14} py={14} />
        <Box
          flex
          pr={14}
          py={14}
          row
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={showSeparate ? 1 : 0}
          borderBottomColor={'#3d3d3f'}
        >
          <Text color={isDanger ? '#ea3a3c' : '#FFF'}>{title}</Text>
          {_renderRight ? _renderRight : _defaultRenderRight}
        </Box>
      </Box>
    </Touchable>
  );
};

export default Object.assign(SettingItem, { Group: SettingGroup });
