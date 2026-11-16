export const url = "http://localhost:4000/api";

export const api = {
    getMovies: `${url}/movies`,
    getMovieById: (id: string) => `${url}/movies/${id}`,
    createMovie: `${url}/movies`,
    updateMovie: (id: string) => `${url}/movies/${id}`,
    deleteMovie: (id: string) => `${url}/movies/${id}`,
    getActors: `${url}/actors`,
    getActorById: (id: string) => `${url}/actors/${id}`,
    createActor: `${url}/actors`,
    updateActor: (id: string) => `${url}/actors/${id}`,
    deleteActor: (id: string) => `${url}/actors/${id}`,
}

export const fetcher = async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching ${url}`);
    }
    return response.json();
};