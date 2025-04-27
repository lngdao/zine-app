export type AlertConfigParams = {
  /**
   * Tiêu đề Alert.
   * Default value: `Thông báo`
   */
  title?: string;
  /**
   * Nội dung Alert.
   * Default value: ``
   */
  content?: string;
  /**
   * Kiểu hiển thị của Alert.
   * Default value: `standard`
   */
  type?: 'standard' | 'minify';
  /**
   * Tiêu đề nút xác nhận.
   * Default value: `Xác nhận`
   */
  confirmTitle?: string;
  /**
   * Tiêu đề nút huỷ.
   * Default value: `Huỷ`
   */
  cancelTitle?: string;
  /**
   * Gọi khi xác nhận.
   */
  onConfirm?: () => void;
  /**
   * Gọi khi huỷ.
   */
  onCancel?: () => void;
  /**
   * Tắt Alert khi bấm bên ngoài content view.
   * Default value: `false`
   */
  overlayCancel?: boolean;
  /**
   * Thay đổi UI Alert.
   */
  renderCustomUI?: React.ReactNode;
  /**
   * useNativeDriver animation.
   * Default value: `true`
   */
  useNativeDriver?: boolean;
};

export type AlertHandler = {
  show: (config?: AlertConfigParams) => void;
  hide: () => void;
};
