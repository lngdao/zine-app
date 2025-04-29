import React, { useEffect, useState } from 'react';
import { Box } from '../box';
import { Text } from '../text';
import { ScrollView, TextInput } from 'react-native';
import Monicon from '@monicon/native';
import SettingSection from '../SettingSection';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { movieCountries, movieFormat, movieGenres, movieYear } from '@/config';
import _ from 'lodash';
import { FadeIn } from 'react-native-reanimated';
import { Filter, FilterType } from './_types';

interface Props {
  type: FilterType;
  onChange: (type: FilterType, filter: Filter) => void;
  initialFilter?: Filter;
}

const DetailFilterPage = ({ type, onChange, initialFilter }: Props) => {
  const { bottom: bottomInset } = useSafeAreaInsets();

  const [filters, setFilters] = useState<Filter[]>([]);
  const [inputSearch, setInputSearch] = useState('');

  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);

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
    if (!_.isEmpty(selectedFilter)) {
      onChange(type, selectedFilter);
    }
  }, [selectedFilter]);

  const renderSearch = () => {
    return (
      <Box gap={5} row alignItems="center" bg={'#1a1a1c'} rounded={8} px={10}>
        <Box>
          <Monicon name="ri:search-line" color="#9f9fa2" size={18} />
        </Box>
        <Box flex>
          <TextInput
            value={inputSearch}
            onChangeText={setInputSearch}
            style={{
              color: '#FFF',
              fontSize: 16,
              paddingVertical: 10,
              fontFamily: Text.fonts.inter.regular,
            }}
            placeholder="Tìm kiếm"
            placeholderTextColor={'#9f9fa2'}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Box px={15} flex>
      {renderSearch()}
      <Box flex mt={10}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomInset }}
        >
          <SettingSection.Group>
            {filters.map((filter, index) => {
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
                    setSelectedFilter(filter);
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
