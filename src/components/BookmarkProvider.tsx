import {
  BOOKMARD_DEFAULT_ID,
  BOOKMARD_DEFAULT_NAME,
  STORAGE_BOOKMARK,
} from '@/config';
import { getItem, removeItem, setItem } from '@/libs/storage';
import { BookmarkContext } from '@/shared/contexts/bookmarkContext';
import { Bookmark, BookmarkMovie } from '@/types/models/movie';
import _ from 'lodash';
import React, { PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner-native';
import { Box } from './box';
import { BlurView } from '@react-native-community/blur';
import { StyleSheet } from 'react-native';
import Monicon from '@monicon/native';
import { Text } from './text';

const BookmarkProvider = ({ children }: PropsWithChildren) => {
  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([]);

  const createBookmark = (bookmark: Bookmark) => {
    setBookmarks((prev) => {
      const isExist = prev.findIndex((item) => item.id === bookmark.id) !== -1;

      if (isExist) {
        return prev;
      } else {
        return [...prev, bookmark];
      }
    });
  };

  const bookmarkMovie = (bookmarkId: string, movies: BookmarkMovie[]) => {
    const isExistBookmark =
      bookmarks.findIndex((item) => item.id === bookmarkId) !== -1;

    if (!isExistBookmark) return;

    const updatedBookmarks = bookmarks.map((item) => {
      if (item.id === bookmarkId) {
        return {
          ...item,
          movies: [...movies, ...item.movies],
        };
      }

      return item;
    });

    setBookmarks(updatedBookmarks);
    setItem(STORAGE_BOOKMARK, updatedBookmarks);
  };

  const unBookmarkMovie = (bookmarkId: string, movies: BookmarkMovie[]) => {
    const isExistBookmark =
      bookmarks.findIndex((item) => item.id === bookmarkId) !== -1;

    if (!isExistBookmark) return;

    const updatedBookmarks = bookmarks.map((item) => {
      if (item.id === bookmarkId) {
        return {
          ...item,
          movies: item.movies.filter(
            (movie) => !movies.some((item) => item._id === movie._id),
          ),
        };
      }

      return item;
    });

    setBookmarks(updatedBookmarks);
    setItem(STORAGE_BOOKMARK, updatedBookmarks);
  };

  const clearAll = async () => {
    await removeItem(STORAGE_BOOKMARK);
    setBookmarks([]);
    createBookmark({
      id: BOOKMARD_DEFAULT_ID,
      name: BOOKMARD_DEFAULT_NAME,
      movies: [],
    });
    toast.custom(
      <Box px={15}>
        <Box py={12} px={10} rounded={4} overflow="hidden">
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={15}
            reducedTransparencyFallbackColor="white"
          />
          <Box row alignItems="center" gap={10}>
            <Monicon name="ri:delete-bin-5-line" size={24} color="#FFF" />
            <Text>Đã xoá dữ liệu</Text>
          </Box>
        </Box>
      </Box>,
    );
  };

  useEffect(() => {
    const storageBookmarks = getItem<Bookmark[]>(STORAGE_BOOKMARK) || [];

    if (_.isEmpty(storageBookmarks)) {
      createBookmark({
        id: BOOKMARD_DEFAULT_ID,
        name: BOOKMARD_DEFAULT_NAME,
        movies: [],
      });
    } else {
      setBookmarks(storageBookmarks);
    }
  }, []);

  const contextValues = {
    bookmarks,
    createBookmark,
    bookmarkMovie,
    unBookmarkMovie,
    clearAll,
  };

  return (
    <BookmarkContext.Provider value={contextValues}>
      {children}
    </BookmarkContext.Provider>
  );
};

export default BookmarkProvider;
