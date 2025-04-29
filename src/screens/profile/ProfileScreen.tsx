import React from 'react';
import { ScreenShell } from '@/components/screen-shell';
import { Box } from '@/components/box';
import { Text } from '@/components/text';
import { Linking } from 'react-native';
import AnimatedHeader, {
  useAnimatedHeaderHeight,
} from '@/components/AnimatedHeader';
import Animated, {
  useAnimatedRef,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { usePlayer } from '@/shared/contexts/playerContext';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import {
  APP_BUILD,
  APP_DIST,
  APP_NAME,
  APP_VER,
  SCREEN_NAME,
  TAB_BAR_HEIGHT,
} from '@/config';
import { RNAlert } from '@/components/RNAlert/RNAlert';
import { useBookmark } from '@/shared/contexts/bookmarkContext';
import { ReactNativeLegal } from 'react-native-legal';
import SettingSection from '@/components/SettingSection';

const ProfileScreen = () => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const { useWebViewPlayer, toggleUseWebViewPlayer } = usePlayer();
  const { clearAll } = useBookmark();

  const animatedHeaderHeight = useAnimatedHeaderHeight();

  return (
    <ScreenShell scrollable={false}>
      <AnimatedHeader
        showBack={false}
        title="Cài đặt"
        scrollOffset={scrollOffset}
      />
      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: animatedHeaderHeight,
          paddingBottom: TAB_BAR_HEIGHT + 50,
        }}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <AnimatedHeader.LargeTitle
          title={'Cài đặt'}
          scrollOffset={scrollOffset}
        />
        <Box gap={30} mt={25}>
          <Box px={15}>
            <SettingSection.Group groupTitle="CHUNG">
              <SettingSection readOnly title={'Giao diện'} subTitle={'Tối'} />
              {/* <SettingSection title={'Chế độ ẩn danh'} /> */}
            </SettingSection.Group>
          </Box>
          <Box px={15}>
            <SettingSection.Group
              groupTitle="TRÌNH PHÁT"
              groupDescription="Trình phát WebView sẽ tự động được bật nếu luồng phát stream bị lỗi"
            >
              <SettingSection
                onPress={toggleUseWebViewPlayer as TFunction}
                title={'Dùng WebView Player khi cần'}
                subTitle={useWebViewPlayer ? 'Bật' : 'Tắt'}
              />
            </SettingSection.Group>
          </Box>
          <Box px={15}>
            <SettingSection.Group groupTitle="THƯ VIỆN">
              <SettingSection
                onPress={() => navigationHelper.navigate(SCREEN_NAME.Bookmark)}
                title={'Danh sách đã thích'}
              />
              {/* <SettingSection
                onPress={() => navigationHelper.navigate(SCREEN_NAME.Filter)}
                title={'Xem gần đây'}
              /> */}
            </SettingSection.Group>
          </Box>
          {/* <Box px={15}>
            <SettingSection.Group
              groupTitle="SAO LƯU"
              groupDescription="Lưu trữ bản sao lưu và có thể nhập vào để áp dụng thay đổi bất kì lúc nào"
            >
              <SettingSection
                showRightIcon={false}
                onPress={() => {}}
                title={'Tạo bản sao lưu'}
              />
              <SettingSection
                showRightIcon={false}
                onPress={() => {}}
                title={'Nhập bản sao lưu'}
              />
            </SettingSection.Group>
          </Box> */}
          <Box px={15}>
            <SettingSection.Group groupTitle="THÔNG TIN">
              <SettingSection
                title={'Góp ý'}
                onPress={() => Linking.openURL('https://t.me/lngdao')}
                showRightIcon={false}
              />
              <SettingSection
                readOnly
                title={'Phiên bản'}
                subTitle={`${APP_VER}-${APP_DIST}`.toUpperCase()}
              />
              <SettingSection
                readOnly
                title={'Bản dựng'}
                subTitle={APP_BUILD}
              />
            </SettingSection.Group>
          </Box>
          <Box px={15}>
            <SettingSection.Group groupTitle="NÂNG CAO">
              <SettingSection
                title={'OS Licenses'}
                showRightIcon={false}
                onPress={() => {
                  ReactNativeLegal.launchLicenseListScreen('OPEN SOURCE');
                }}
              />
              <SettingSection
                isDanger
                title={'Xoá dữ liệu'}
                showRightIcon={false}
                onPress={() => {
                  RNAlert.show({
                    content:
                      'Thao tác này sẽ xoá hết dữ liệu của ứng dụng. Bạn có muốn tiếp tục?',
                    onConfirm: () => {
                      clearAll();
                    },
                  });
                }}
              />
            </SettingSection.Group>
          </Box>
        </Box>
        <Box center mt={40} gap={5}>
          <Text color="#6d6d6d" fontFamily={Text.fonts.inter.extraBold}>
            {APP_NAME}
          </Text>
          <Text color="#6d6d6d" size={11}>
            {`Ver.${APP_VER}-${APP_DIST} (${APP_BUILD})`.toUpperCase()}
          </Text>
        </Box>
      </Animated.ScrollView>
    </ScreenShell>
  );
};

export default ProfileScreen;
