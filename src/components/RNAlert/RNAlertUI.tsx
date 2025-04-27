import React from 'react';
import { styles } from './RNAlert.style';
import { AlertConfigParams } from './RNAlert.type';
import { Touchable } from '../button';
import { Box } from '../box';
import { Text } from '../text';

const RNAlertUI = (props: AlertConfigParams) => {
  const {
    title,
    content,
    type,
    onConfirm,
    onCancel,
    confirmTitle,
    cancelTitle,
    renderCustomUI,
  } = props;

  return React.isValidElement(renderCustomUI) ? (
    renderCustomUI
  ) : (
    <>
      <Box style={styles.contentBlock}>
        <Text size={16} fontFamily={Text.fonts.inter.medium}>
          {title}
        </Text>
        <Text mt={12} textAlign="center" color="#c6c6c6">
          {content}
        </Text>
      </Box>
      <Box style={styles.btnBlock}>
        {type === 'standard' && (
          <>
            <Touchable style={styles.btnView} onPress={onCancel!}>
              <Text color="#1f6efc" fontFamily={Text.fonts.inter.semiBold}>
                {cancelTitle}
              </Text>
            </Touchable>
            <Box bg={'#3e3e40'} w={1} hFull />
          </>
        )}
        <Touchable style={styles.btnView} onPress={onConfirm!}>
          <Text color="#1f6efc" fontFamily={Text.fonts.inter.semiBold}>
            {confirmTitle}
          </Text>
        </Touchable>
      </Box>
    </>
  );
};

export default RNAlertUI;
