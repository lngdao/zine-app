import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSvg } from '../icon-svg/IconSvg';
import R from '@/assets';

const OfflineStatus = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.sub_view}>
        <IconSvg source={R.icons.ic_warn} color="white" size={20} />
        <Text style={styles.title}>No internet connection!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 40,
  },
  sub_view: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    color: 'white',
    fontFamily: 'FixelDisplay-Medium',
  },
});

export default OfflineStatus;
