import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '../box';
import { Text } from '../text';
import { ScrollView } from 'react-native';
import Monicon from '@monicon/native';
import SettingSection from '../SettingSection';
import { movieCountries, movieFormat, movieGenres, movieYear } from '@/config';
import _ from 'lodash';
import { FadeIn } from 'react-native-reanimated';
import { Filter, FilterType } from './_types';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { removeVietnameseTones } from '@/shared/utils/common';

interface Props {
  type: FilterType;
  onChange: (type: FilterType, filter: Filter | null) => void;
  initialFilter?: Filter;
  inputSearch: string;
  setInputSearch: React.Dispatch<React.SetStateAction<string>>;
}

const DetailFilterPage = ({
  type,
  onChange,
  initialFilter,
  inputSearch,
  setInputSearch,
}: Props) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);

  const searchData = useMemo(() => {
    if (!inputSearch.length) return filters;

    const normalizedSearchText = removeVietnameseTones(inputSearch);

    return filters.filter((item) =>
      removeVietnameseTones(item.name).includes(normalizedSearchText),
    );
  }, [inputSearch, filters]);

  useEffect(() => {
    switch (type) {
      case FilterType.Type:
        return setFilters(Object.values(movieFormat));
      case FilterType.Genre:
        return setFilters(Object.values(movieGenres));
      case FilterType.Region:
        return setFilters(Object.values(movieCountries));
      case FilterType.Sub:
      // return setFilters(Object.values())
      case FilterType.Sort:
      case FilterType.Year:
        return setFilters(Object.values(movieYear).reverse());
    }
  }, [type]);

  useEffect(() => {
    if (initialFilter) {
      setSelectedFilter(initialFilter);
    }
  }, [initialFilter]);

  useEffect(() => {
    onChange(type, selectedFilter);
  }, [selectedFilter]);

  const renderSearch = () => {
    return (
      <Box gap={5} row alignItems="center" bg={'#1a1a1c'} rounded={8} px={10}>
        <Box>
          <Monicon name="ri:search-line" color="#9f9fa2" size={18} />
        </Box>
        <Box flex>
          <BottomSheetTextInput
            style={{
              paddingVertical: 10,
              fontSize: 16,
              color: '#FFF',
              fontFamily: Text.fonts.inter.regular,
            }}
            value={inputSearch}
            onChangeText={setInputSearch}
            placeholder="Tìm kiếm tập phim..."
            placeholderTextColor={'#dbdbdb'}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Box px={15} wFull hFull>
      {renderSearch()}
      <Box flex mt={10}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <SettingSection.Group>
            {searchData.map((filter, index) => {
              const isSelect = _.isEqual(selectedFilter, filter);

              return (
                <SettingSection
                  key={index}
                  title={filter.name}
                  addTitle="Thuyết minh"
                  _renderRight={
                    isSelect ? (
                      <Box.Animated entering={FadeIn}>
                        <Monicon name="ri:check-line" color="#FFF" size={18} />
                      </Box.Animated>
                    ) : (
                      <Box />
                    )
                  }
                  onPress={() => {
                    const isExist = _.isEqual(selectedFilter, filter);

                    if (isExist) {
                      setSelectedFilter(null);
                    } else {
                      setSelectedFilter(filter);
                    }
                  }}
                />
              );
            })}
          </SettingSection.Group>
        </ScrollView>
      </Box>
    </Box>
  );
};

export default DetailFilterPage;
