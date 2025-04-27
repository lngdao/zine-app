declare module '*.svg' {
  const content: any;
  export default content;
}

type TFunction = () => void;

type ApiResponse<T> = {
  movie: T;
  status: string;
  msg: string;
};

type ApiResponsePagination<T> = {
  status: string;
  msg: string;
  data: {
    items: T[];
    APP_DOMAIN_FRONTEND: string;
    APP_DOMAIN_CDN_IMAGE: string;
    params: {
      pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        totalPages: number;
      };
    };
  };
};

type ApiRecentResponsePagination<T> = {
  status: string;
  msg: string;
  items: T[];
  pagination: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
};
