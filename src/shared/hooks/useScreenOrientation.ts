import { useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';
import RNOrientationDirector, {
  Orientation,
} from 'react-native-orientation-director';
import { OrientationEvent } from 'react-native-orientation-director/lib/typescript/src/types/OrientationEvent.interface';

export const useScreenOrientation = singletonHook(
  {
    isLandscape: false,
    screenOrientation: Orientation.portrait,
  },
  () => {
    const [screenOrientation, setScreenOrientation] = useState<Orientation>(
      Orientation.portrait,
    );

    const onOrientationChange = (result: OrientationEvent) => {
      setScreenOrientation(result.orientation);
    };

    useEffect(() => {
      const listener =
        RNOrientationDirector.listenForInterfaceOrientationChanges(
          onOrientationChange,
        );

      return () => {
        listener.remove();
      };
    }, []);

    return {
      isLandscape:
        screenOrientation === Orientation.landscape ||
        screenOrientation === Orientation.landscapeLeft ||
        screenOrientation === Orientation.landscapeRight,
      screenOrientation,
    };
  },
);
