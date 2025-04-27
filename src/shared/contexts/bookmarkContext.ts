import { STORAGE_BOOKMARK } from '@/config';
import { getItem } from '@/libs/storage';
import { Bookmark, BookmarkMovie } from '@/types/models/movie';
import _ from 'lodash';
import React from 'react';

interface BookmarkContextProps {
  bookmarks: Bookmark[];
  createBookmark: (bookmark: Bookmark) => void;
  bookmarkMovie: (bookmarkId: string, movies: BookmarkMovie[]) => void;
  unBookmarkMovie: (bookmarkId: string, movies: BookmarkMovie[]) => void;
  clearAll: () => void;
}

const defaultContextValue: BookmarkContextProps = {
  bookmarks: [],
  createBookmark: () => {},
  bookmarkMovie: () => {},
  unBookmarkMovie: () => {},
  clearAll: () => {},
};

export const BookmarkContext =
  React.createContext<BookmarkContextProps>(defaultContextValue);

export const useBookmark = (_movieId?: string) => {
  const storageBookmarks = getItem<Bookmark[]>(STORAGE_BOOKMARK) || [];
  const context = React.useContext(BookmarkContext);

  let isBookmarked: boolean = false;

  if (_movieId && !_.isEmpty(storageBookmarks)) {
    isBookmarked = storageBookmarks.some((bookmark) =>
      bookmark.movies.some((movie) => movie._id === _movieId),
    );
  }

  // if (!_movieId) {
  //   return { ...context };
  // }

  return { isBookmarked, ...context };
};
