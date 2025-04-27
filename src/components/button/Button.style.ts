import { TColor, colors, spacing } from '@/shared/theme';
import { rgba } from '@/shared/utils/common';
import { StyleSheet } from 'react-native';
import { ButtonSizes, ButtonVariants } from './Button.type';

export const buttonStyles = (
  themeColors: TColor,
  variant: ButtonVariants = ButtonVariants.FLAT,
  size: ButtonSizes = ButtonSizes.MD,
) =>
  StyleSheet.create({
    disabled_style: {
      opacity: 0.4,
    },
    press_in: (() => {
      switch (variant) {
        case ButtonVariants.FLAT:
          return {
            backgroundColor: rgba(themeColors.button.primary, 0.8),
            opacity: 0.9,
          };
        case ButtonVariants.OUTLINE:
          return {
            backgroundColor: colors.transparent,
            borderWidth: 1,
            borderColor: themeColors.button.primary,
            opacity: 0.5,
          };
        case ButtonVariants.DANGER:
          return {
            backgroundColor: themeColors.button.danger,
            opacity: 0.6,
          };
        default:
          return {};
      }
    })(),
    sizeStyle: (() => {
      switch (size) {
        case ButtonSizes.XS:
          return {
            paddingHorizontal: spacing.scale(8),
            paddingVertical: spacing.vScale(4),
          };
        case ButtonSizes.SM:
          return {
            paddingHorizontal: spacing.scale(16),
            paddingVertical: spacing.vScale(8),
          };
        case ButtonSizes.MD:
          return {
            paddingHorizontal: spacing.scale(20),
            paddingVertical: spacing.vScale(10),
          };
        case ButtonSizes.LG:
          return {
            paddingHorizontal: spacing.scale(28),
            paddingVertical: spacing.vScale(14),
          };
        default:
          return {
            paddingHorizontal: spacing.scale(20),
            paddingVertical: spacing.vScale(10),
          };
      }
    })(),
    variantStyle: (() => {
      switch (variant) {
        case ButtonVariants.GHOST:
          return {};
        case ButtonVariants.FLAT:
          return {
            backgroundColor: themeColors.button.primary,
          };
        case ButtonVariants.OUTLINE:
          return {
            backgroundColor: colors.transparent,
            borderWidth: 1,
            borderColor: themeColors.button.primary,
          };
        case ButtonVariants.DANGER:
          return {
            backgroundColor: themeColors.button.danger,
          };
        default:
          return {
            backgroundColor: themeColors.button.primary,
          };
      }
    })(),
  });
