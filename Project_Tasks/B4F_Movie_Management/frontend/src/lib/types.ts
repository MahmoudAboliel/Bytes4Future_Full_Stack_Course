export interface Movie {
  createdAt: string;
  director: string;
  genres: string[];
  image: string;
  productYear: string;
  rating: string;
  title: string;
  updatedAt: string;
  _id: string;
}

export interface Actor {
    _id: string;
    birthDate: string;
    createdAt: string;
    image: string;
    name: string;
    nationality: string;
    updatedAt: string;
}