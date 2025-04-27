import { instance } from '@/libs/api';
import qs from 'qs';
import { Episode, Movie, MovieBanner, MovieCommon } from '@/types/models/movie';

interface CommonParamsList {
  page?: number;
  limit?: number;
  year?: string;
}

export const getMovie = ({
  slug,
}: {
  slug: string;
}): Promise<ApiResponse<Movie> & { episodes: Episode[] }> => {
  return instance.get(`phim/${slug}`).json();
};

export const getRecentMovies = (
  payload: CommonParamsList,
): Promise<ApiRecentResponsePagination<MovieBanner>> => {
  const queryString = qs.stringify(payload, { skipNulls: true });

  return instance.get(`danh-sach/phim-moi-cap-nhat?${queryString}`).json();
};

export const getRecentMoviesV2 = (
  payload: CommonParamsList,
): Promise<ApiRecentResponsePagination<MovieBanner>> => {
  const queryString = qs.stringify(payload, { skipNulls: true });

  return instance.get(`danh-sach/phim-moi-cap-nhat-v2?${queryString}`).json();
};

export const getRecentMoviesV3 = ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}): Promise<ApiRecentResponsePagination<MovieBanner>> => {
  const params: { page?: number; limit?: number } = {};

  if (page) {
    params.page = page;
  }

  if (limit) {
    params.limit = limit;
  }

  const queryString = qs.stringify(params, { skipNulls: true });

  return instance.get(`danh-sach/phim-moi-cap-nhat-v3?${queryString}`).json();
};

export const getMoviesByCategory = ({
  category,
  page,
  limit,
}: {
  category: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponsePagination<MovieCommon>> => {
  const params: { category: string; page?: number; limit?: number } = {
    category,
  };

  if (page) {
    params.page = page;
  }

  if (limit) {
    params.limit = limit;
  }

  const queryString = qs.stringify(params, { skipNulls: true });

  return instance.get(`v1/api/danh-sach/${category}?${queryString}`).json();
};

export const getMoviesByGenre = ({
  genre,
  page,
  limit,
}: {
  genre: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponsePagination<MovieCommon>> => {
  const params: { genre: string; page?: number; limit?: number } = { genre };

  if (page) {
    params.page = page;
  }

  if (limit) {
    params.limit = limit;
  }

  const queryString = qs.stringify(params, { skipNulls: true });

  return instance.get(`v1/api/the-loai/${genre}?${queryString}`).json();
};

export const getMoviesByRegion = ({
  region,
  page,
  limit,
}: {
  region: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponsePagination<MovieCommon>> => {
  const params: { region: string; page?: number; limit?: number } = { region };

  if (page) {
    params.page = page;
  }

  if (limit) {
    params.limit = limit;
  }

  const queryString = qs.stringify(params, { skipNulls: true });

  return instance.get(`v1/api/quoc-gia/${region}?${queryString}`).json();
};

export const getMoviesByYear = (payload: {
  year: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponsePagination<MovieCommon>> => {
  const queryString = qs.stringify(payload, { skipNulls: true });

  return instance.get(`v1/api/nam/${payload.year}?${queryString}`).json();
};

export const getMoviesByKeyword = ({
  keyword,
  page,
}: {
  keyword: string;
  page?: number;
}): Promise<ApiResponsePagination<MovieCommon>> => {
  const params: { keyword: string; page?: number } = {
    keyword,
  };

  if (page) {
    params.page = page;
  }

  const queryString = qs.stringify(params, { skipNulls: true });

  return instance.get(`v1/api/tim-kiem?${queryString}`).json();
};

export const getMovies = ({
  type_list,
  page,
  limit,
  year,
}: {
  type_list: string;
  page?: number;
  limit?: number;
  year?: string;
}): Promise<ApiResponsePagination<MovieCommon>> => {
  const queryString = qs.stringify({ page, limit, year }, { skipNulls: true });

  return instance.get(`v1/api/danh-sach/${type_list}?${queryString}`).json();
};
