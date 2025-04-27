import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { styles } from './RNAlert.style';
import { AlertConfigParams, AlertHandler } from './RNAlert.type';
import RNAlertUI from './RNAlertUI';

type AlertRefObj = {
  current: AlertHandler | null;
};

const { width, height } = Dimensions.get('window');
const DEFAULT_TITLE = 'Thông báo';
const DEFAULT_CONFIRM_TITLE = 'Xác nhận';
const DEFAULT_CANCEL_TITLE = 'Huỷ';
let refs: AlertRefObj[] = [];

const AlertRoot = forwardRef<AlertHandler, any>(({}, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [contentViewSize, setContentViewSize] = useState({
    width: 0,
    height: 0,
  });
  const [alertConfigParams, setAlertConfigParams] = useState<AlertConfigParams>(
    {
      title: DEFAULT_TITLE,
      content: '',
      confirmTitle: DEFAULT_CONFIRM_TITLE,
      cancelTitle: DEFAULT_CANCEL_TITLE,
      overlayCancel: false,
      useNativeDriver: true,
    },
  );

  const _alertScaleSpringValue = useRef(new Animated.Value(0)).current;
  const animation = { transform: [{ scale: _alertScaleSpringValue }] };

  const showAlert = () => {
    Animated.spring(_alertScaleSpringValue, {
      toValue: 1,
      bounciness: 3,
      useNativeDriver: alertConfigParams.useNativeDriver!,
    }).start();

    setIsVisible(true);
  };

  const hideAlert = () => {
    Animated.spring(_alertScaleSpringValue, {
      toValue: 0,
      tension: 3,
      useNativeDriver: alertConfigParams?.useNativeDriver ?? true,
    }).start();

    setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const show = (config?: AlertConfigParams) => {
    let alertConfig = {
      title: !!config?.title ? config.title : DEFAULT_TITLE,
      content: !!config?.content ? config.content : '',
      type: !!config?.type ? config.type : 'standard',
      confirmTitle: !!config?.confirmTitle
        ? config.confirmTitle
        : DEFAULT_CONFIRM_TITLE,
      cancelTitle: !!config?.cancelTitle
        ? config.cancelTitle
        : DEFAULT_CANCEL_TITLE,
      onConfirm: () => {
        !!config?.onConfirm && config.onConfirm!();
        hideAlert();
      },
      onCancel: () => {
        !!config?.onCancel && config.onCancel!();
        hideAlert();
      },
      renderCustomUI: config?.renderCustomUI,
      overlayCancel: !!config?.overlayCancel,
      useNativeDriver: true,
    };

    setAlertConfigParams(alertConfig);
    showAlert();
  };

  const hide = () => {
    hideAlert();
  };

  useImperativeHandle(
    ref,
    useCallback(
      () => ({
        show,
        hide,
      }),
      [],
    ),
  );

  return (
    <Modal animationType="none" transparent visible={isVisible}>
      <TouchableWithoutFeedback
        disabled={!alertConfigParams.overlayCancel}
        onPress={hideAlert}
      >
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <Animated.View
        onLayout={(event) => {
          const size = event.nativeEvent.layout;
          setContentViewSize({ width: size.width, height: size.height });
        }}
        style={[
          styles.alertWrapper,
          animation,
          {
            marginLeft: (width - contentViewSize.width) / 2,
            marginTop: (height - contentViewSize.height) / 2,
          },
        ]}
      >
        <RNAlertUI {...alertConfigParams} />
      </Animated.View>
    </Modal>
  );
});

function addNewRef(newRef: AlertHandler) {
  refs.push({
    current: newRef,
  });
}

function removeOldRef(oldRef: AlertHandler | null) {
  refs = refs.filter((r) => r.current !== oldRef);
}

function getRef() {
  const reversePriority = [...refs].reverse();
  const activeRef = reversePriority.find((ref) => ref?.current !== null);
  if (!activeRef) {
    return null;
  }
  return activeRef.current;
}

const RNAlert = () => {
  const AlertRef = useRef<React.ElementRef<typeof AlertRoot> | null>(null);

  const setRef = React.useCallback((ref: AlertHandler | null) => {
    if (ref) {
      AlertRef.current = ref;
      addNewRef(ref);
    } else {
      removeOldRef(AlertRef.current);
    }
  }, []);

  return <AlertRoot ref={setRef} />;
};

export { RNAlert };

RNAlert.show = (config?: AlertConfigParams) => {
  getRef()?.show(config);
};

RNAlert.hide = () => {
  getRef()?.hide();
};
