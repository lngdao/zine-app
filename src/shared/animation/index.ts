import { FadeInDown } from 'react-native-reanimated';

export const CustomFadeInDown = FadeInDown.withInitialValues({
  opacity: 0,
  translateY: 10,
}).build();
