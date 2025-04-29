export enum FilterType {
  Type = 0,
  Genre,
  Region,
  Sub,
  Sort,
  Year,
}

export interface Filter {
  name: string;
  slug: string;
}

export interface MovieFilter {
  type?: Filter;
  genre?: Filter;
  region?: Filter;
  sub?: Filter;
  sort?: Filter;
  year?: Filter;
}
