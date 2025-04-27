export interface MovieBanner {
  modified: Modified;
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  year: number;
}

export interface MovieCommon {
  modified: Modified;
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  poster_url: string;
  thumb_url: string;
  sub_docquyen: boolean;
  chieurap: boolean;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
  category: Category[];
  country: Category[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Modified {
  time: Date;
}

export interface Movie {
  tmdb: Tmdb;
  imdb: Imdb;
  created: Created;
  modified: Created;
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: Category[];
  country: Category[];
}

export interface BookmarkMovie {
  _id: string;
  name: string;
  origin_name: string;
  content: string;
  slug: string;
  poster_url: string;
  thumb_url: string;
}

export interface Bookmark {
  id: string;
  name: string;
  movies: BookmarkMovie[];
}

export interface Created {
  time: Date;
}

export interface Imdb {
  id: null;
}

export interface Tmdb {
  type: null;
  id: null;
  season: null;
  vote_average: number;
  vote_count: number;
}

export interface Episode {
  server_name: string;
  server_data: ServerDatum[];
}

export interface ServerDatum {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}
