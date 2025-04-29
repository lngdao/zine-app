import React from 'react';
import { Box } from '../box';
import SettingSection from '../SettingSection';
import { ScrollView } from 'react-native';
import { MovieFilter } from './_types';

export interface FilterShowHideProps {
  showTypeFilter?: boolean;
  showGenreFilter?: boolean;
  showRegionFilter?: boolean;
  showSubFilter?: boolean;
  showYearFilter?: boolean;
  showSortFilter?: boolean;
}

interface Props extends FilterShowHideProps {
  movieFilter: MovieFilter;
  onTypePress: () => void;
  onGenrePress: () => void;
  onRegionPress: () => void;
  onSubPress: () => void;
  onYearPress: () => void;
  onSortPress: () => void;
}

const MainFilterPage = ({
  movieFilter,
  onTypePress,
  onGenrePress,
  onRegionPress,
  onSubPress,
  onSortPress,
  showTypeFilter = true,
  showGenreFilter = true,
  showRegionFilter = true,
  showSubFilter = true,
  showYearFilter = true,
  showSortFilter,
}: Props) => {
  return (
    <Box px={15} wFull hFull>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <SettingSection.Group>
          {showTypeFilter && (
            <SettingSection
              title={'Loại phim'}
              addTitle={movieFilter.type?.name || ''}
              showRightIcon
              onPress={onTypePress}
            />
          )}
          {showGenreFilter && (
            <SettingSection
              title={'Thể loại'}
              addTitle={movieFilter.genre?.name || ''}
              showRightIcon
              onPress={onGenrePress}
            />
          )}
          {showRegionFilter && (
            <SettingSection
              title={'Quốc gia'}
              addTitle={movieFilter.region?.name || ''}
              showRightIcon
              onPress={onRegionPress}
            />
          )}
          {showSubFilter && (
            <SettingSection
              title={'Phiên bản'}
              addTitle={movieFilter.sub?.name || ''}
              showRightIcon
              onPress={onSubPress}
            />
          )}
          {showYearFilter && (
            <SettingSection
              title={'Năm phát hành'}
              addTitle={movieFilter.year?.name || ''}
              showRightIcon
              onPress={onSortPress}
            />
          )}
          {showSortFilter && (
            <SettingSection
              title={'Sắp xếp'}
              addTitle={movieFilter.sort?.name || ''}
              showRightIcon
              onPress={onSortPress}
            />
          )}
        </SettingSection.Group>
      </ScrollView>
    </Box>
  );
};

export default MainFilterPage;
