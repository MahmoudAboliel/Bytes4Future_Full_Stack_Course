/**
 * عميل TMDB API — يوفر بيانات الأفلام والممثلين.
 * التوثيق: https://developer.themoviedb.org/docs
 */

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY ?? '';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export type Lang = 'ar' | 'en';

/** يبني رابط صورة من مسار TMDB، أو null إذا لا توجد صورة */
export function imageUrl(
  path: string | null | undefined,
  size: 'w185' | 'w342' | 'w500' | 'h632' | 'original' = 'w342',
): string | null {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export type TmdbErrorKind = 'network' | 'missingKey' | 'api';

export class TmdbError extends Error {
  readonly kind: TmdbErrorKind;

  constructor(kind: TmdbErrorKind, message?: string) {
    super(message ?? kind);
    this.kind = kind;
    this.name = 'TmdbError';
  }
}

function tmdbLang(lang: Lang): string {
  return lang === 'ar' ? 'ar' : 'en-US';
}

async function request<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
  if (!API_KEY) {
    throw new TmdbError('missingKey');
  }

  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  const url = `${BASE_URL}${path}?api_key=${encodeURIComponent(API_KEY)}${query ? `&${query}` : ''}`;

  let response: Response;
  try {
    response = await fetch(url, { headers: { accept: 'application/json' } });
  } catch {
    throw new TmdbError('network');
  }

  const body = (await response.json().catch(() => null)) as
    | (T & { status_message?: string })
    | null;

  if (!response.ok || !body) {
    throw new TmdbError('api', body && 'status_message' in body ? body.status_message : undefined);
  }

  return body;
}

// ---------------------------------------------------------------------------
// الأنواع (Types)
// ---------------------------------------------------------------------------

export type MovieListItem = {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  overview: string;
  popularity: number;
};

export type Genre = { id: number; name: string };

export type CastMember = {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
  order: number;
};

export type CrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
};

export type MovieDetails = MovieListItem & {
  genres: Genre[];
  runtime: number | null;
  status: string;
  tagline: string | null;
  original_language: string;
  budget: number;
  revenue: number;
  credits: { cast: CastMember[]; crew: CrewMember[] };
};

export type PersonListItem = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  known_for?: Array<{
    id: number;
    media_type: 'movie' | 'tv';
    title?: string;
    name?: string;
    release_date?: string;
  }>;
};

export type PersonMovie = MovieListItem & {
  character: string;
  credit_id: string;
};

export type PersonDetails = {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  popularity: number;
  movie_credits: { cast: PersonMovie[] };
};

export type Paged<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

// ---------------------------------------------------------------------------
// الطلبات
// ---------------------------------------------------------------------------

export function fetchGenres(lang: Lang): Promise<{ genres: Genre[] }> {
  return request('/genre/movie/list', { language: tmdbLang(lang) });
}

export type MovieSort =
  | 'popularity.desc'
  | 'vote_average.desc'
  | 'release_date.desc'
  | 'release_date.asc'
  | 'title.asc';

export type FetchMoviesOptions = {
  page: number;
  lang: Lang;
  query?: string;
  genreId?: number | null;
  sort?: MovieSort;
  minRating?: number;
  year?: number | null;
};

export async function fetchMovies({
  page,
  lang,
  query,
  genreId,
  sort = 'popularity.desc',
  minRating = 0,
  year,
}: FetchMoviesOptions): Promise<Paged<MovieListItem>> {
  const language = tmdbLang(lang);

  if (query && query.trim()) {
    return request('/search/movie', {
      language,
      page,
      query: query.trim(),
      include_adult: false,
    });
  }

  // عند الترتيب حسب التقييم أو عند تصفية التقييم، نتجاهل الأفلام قليلة التقييم
  const needsVotesGate = minRating > 0 || sort === 'vote_average.desc';

  return request('/discover/movie', {
    language,
    page,
    sort_by: sort,
    with_genres: genreId ?? undefined,
    'vote_average.gte': minRating > 0 ? minRating : undefined,
    'vote_count.gte': needsVotesGate ? 100 : undefined,
    primary_release_year: year ?? undefined,
    include_adult: false,
  });
}

export function fetchMovieDetails(id: number, lang: Lang): Promise<MovieDetails> {
  return request(`/movie/${id}`, {
    language: tmdbLang(lang),
    append_to_response: 'credits',
  });
}

export function fetchPopularPeople(page: number, lang: Lang): Promise<Paged<PersonListItem>> {
  return request('/person/popular', { language: tmdbLang(lang), page });
}

export function searchPeople(query: string, page: number, lang: Lang): Promise<Paged<PersonListItem>> {
  return request('/search/person', {
    language: tmdbLang(lang),
    page,
    query: query.trim(),
    include_adult: false,
  });
}

export function fetchPersonDetails(id: number, lang: Lang): Promise<PersonDetails> {
  return request(`/person/${id}`, {
    language: tmdbLang(lang),
    append_to_response: 'movie_credits',
  });
}
