import { useEffect, useState } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  StatusBar,
} from 'react-native';

const { StatusBarManager } = NativeModules;

export default function useStatusBarHeight() {
  const [value, setValue] = useState(StatusBar.currentHeight || 0);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    const emitter = new NativeEventEmitter(StatusBarManager);

    StatusBarManager.getHeight(({ height }: { height: number }) => {
      setValue(height);
    });

    const listener = emitter.addListener('statusBarFrameWillChange', (data) =>
      setValue(data.frame.height),
    );

    return () => listener.remove();
  }, []);

  return value;
}
