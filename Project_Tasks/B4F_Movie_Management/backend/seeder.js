import "dotenv/config";
import { connect, disconnect, Types } from "mongoose";
import Actor from "./models/actorModel.js";
import Movie from "./models/movieModel.js";
import MovieCast from "./models/movieCastModel.js";

const actorData = [
  ["Daniel Radcliffe", "1989-07-23", "British"],
  ["Rupert Grint", "1988-08-24", "British"],
  ["Emma Watson", "1990-04-15", "British"],
  ["Tom Felton", "1987-09-22", "British"],
  ["Alan Rickman", "1946-02-21", "British"],
  ["Robbie Coltrane", "1950-03-30", "Scottish"],
  ["Maggie Smith", "1934-12-28", "British"],
  ["Bonnie Wright", "1991-02-17", "British"],
  ["Matthew Lewis", "1989-06-27", "British"],
  ["Richard Harris", "1930-10-01", "Irish"],
  ["Michael Gambon", "1940-10-19", "Irish"],
  ["Elijah Wood", "1981-01-28", "American"],
  ["Ian McKellen", "1939-05-25", "British"],
  ["Viggo Mortensen", "1958-10-20", "American"],
  ["Sean Astin", "1971-02-25", "American"],
  ["Orlando Bloom", "1977-01-13", "British"],
  ["John Rhys-Davies", "1944-05-05", "Welsh"],
  ["Dominic Monaghan", "1976-12-08", "British"],
  ["Billy Boyd", "1968-08-28", "Scottish"],
  ["Cate Blanchett", "1969-05-14", "Australian"],
  ["Hugo Weaving", "1960-04-04", "Australian"],
  ["Martin Freeman", "1971-09-08", "British"],
  ["Richard Armitage", "1971-08-22", "British"],
  ["Ken Stott", "1954-10-19", "Scottish"],
  ["Graham McTavish", "1961-01-04", "Scottish"],
  ["Aidan Turner", "1983-06-19", "Irish"],
  ["Dean O'Gorman", "1976-12-01", "New Zealander"],
  ["Mark Hadlow", "1957-04-08", "New Zealander"],
  ["Jed Brophy", "1963-10-29", "New Zealander"],
  ["Adam Brown", "1980-05-29", "British"],
  ["Robert Downey Jr.", "1965-04-04", "American"],
  ["Chris Evans", "1981-06-13", "American"],
  ["Chris Hemsworth", "1983-08-11", "Australian"],
  ["Mark Ruffalo", "1967-11-22", "American"],
  ["Scarlett Johansson", "1984-11-22", "American"],
  ["Jeremy Renner", "1971-01-07", "American"],
  ["Tom Hiddleston", "1981-02-09", "British"],
  ["Samuel L. Jackson", "1948-12-21", "American"],
  ["Clark Gregg", "1962-04-02", "American"],
  ["Cobie Smulders", "1982-04-03", "Canadian"],
  ["Elizabeth Olsen", "1989-02-16", "American"],
  ["Aaron Taylor-Johnson", "1990-06-13", "British"],
  ["Paul Bettany", "1971-05-27", "British"],
  ["James Spader", "1960-02-07", "American"],
  ["Benedict Cumberbatch", "1976-07-19", "British"],
  ["Chadwick Boseman", "1976-11-29", "American"],
  ["Tom Holland", "1996-06-01", "British"],
  ["Chris Pratt", "1979-06-21", "American"],
  ["Josh Brolin", "1968-02-12", "American"],
  ["Paul Rudd", "1969-04-06", "American"],
  ["Brie Larson", "1989-10-01", "American"],
  ["Don Cheadle", "1964-11-29", "American"],
  ["Karen Gillan", "1987-11-28", "Scottish"],
  ["Anthony Mackie", "1978-09-23", "American"],
  ["Sebastian Stan", "1982-08-13", "Romanian-American"],
  ["Tessa Thompson", "1983-10-03", "American"],
  ["Jeff Goldblum", "1952-10-22", "American"],
  ["Karl Urban", "1972-06-07", "New Zealander"],
  ["Idris Elba", "1972-09-06", "British"],
  ["Anthony Hopkins", "1937-12-31", "Welsh"],
];

const films = [
  {
    title: "Harry Potter and the Philosopher's Stone",
    year: 2001, rating: 7.7, director: "Chris Columbus",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Daniel Radcliffe", "Harry Potter"], ["Rupert Grint", "Ron Weasley"],
      ["Emma Watson", "Hermione Granger"], ["Tom Felton", "Draco Malfoy"],
      ["Alan Rickman", "Severus Snape"], ["Robbie Coltrane", "Rubeus Hagrid"],
      ["Maggie Smith", "Minerva McGonagall"], ["Bonnie Wright", "Ginny Weasley"],
      ["Matthew Lewis", "Neville Longbottom"], ["Richard Harris", "Albus Dumbledore"],
    ],
  },
  {
    title: "Harry Potter and the Chamber of Secrets",
    year: 2002, rating: 7.5, director: "Chris Columbus",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Daniel Radcliffe", "Harry Potter"], ["Rupert Grint", "Ron Weasley"],
      ["Emma Watson", "Hermione Granger"], ["Tom Felton", "Draco Malfoy"],
      ["Alan Rickman", "Severus Snape"], ["Robbie Coltrane", "Rubeus Hagrid"],
      ["Maggie Smith", "Minerva McGonagall"], ["Bonnie Wright", "Ginny Weasley"],
      ["Matthew Lewis", "Neville Longbottom"], ["Richard Harris", "Albus Dumbledore"],
    ],
  },
  {
    title: "Harry Potter and the Prisoner of Azkaban",
    year: 2004, rating: 7.9, director: "Alfonso Cuarón",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Daniel Radcliffe", "Harry Potter"], ["Rupert Grint", "Ron Weasley"],
      ["Emma Watson", "Hermione Granger"], ["Tom Felton", "Draco Malfoy"],
      ["Alan Rickman", "Severus Snape"], ["Robbie Coltrane", "Rubeus Hagrid"],
      ["Maggie Smith", "Minerva McGonagall"], ["Bonnie Wright", "Ginny Weasley"],
      ["Matthew Lewis", "Neville Longbottom"], ["Michael Gambon", "Albus Dumbledore"],
    ],
  },
  {
    title: "Harry Potter and the Goblet of Fire",
    year: 2005, rating: 7.7, director: "Mike Newell",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Daniel Radcliffe", "Harry Potter"], ["Rupert Grint", "Ron Weasley"],
      ["Emma Watson", "Hermione Granger"], ["Tom Felton", "Draco Malfoy"],
      ["Alan Rickman", "Severus Snape"], ["Robbie Coltrane", "Rubeus Hagrid"],
      ["Maggie Smith", "Minerva McGonagall"], ["Bonnie Wright", "Ginny Weasley"],
      ["Matthew Lewis", "Neville Longbottom"], ["Michael Gambon", "Albus Dumbledore"],
    ],
  },
  {
    title: "Harry Potter and the Order of the Phoenix",
    year: 2007, rating: 7.5, director: "David Yates",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Daniel Radcliffe", "Harry Potter"], ["Rupert Grint", "Ron Weasley"],
      ["Emma Watson", "Hermione Granger"], ["Tom Felton", "Draco Malfoy"],
      ["Alan Rickman", "Severus Snape"], ["Robbie Coltrane", "Rubeus Hagrid"],
      ["Maggie Smith", "Minerva McGonagall"], ["Bonnie Wright", "Ginny Weasley"],
      ["Matthew Lewis", "Neville Longbottom"], ["Michael Gambon", "Albus Dumbledore"],
    ],
  },
  {
    title: "Harry Potter and the Half-Blood Prince",
    year: 2009, rating: 7.6, director: "David Yates",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Daniel Radcliffe", "Harry Potter"], ["Rupert Grint", "Ron Weasley"],
      ["Emma Watson", "Hermione Granger"], ["Tom Felton", "Draco Malfoy"],
      ["Alan Rickman", "Severus Snape"], ["Robbie Coltrane", "Rubeus Hagrid"],
      ["Maggie Smith", "Minerva McGonagall"], ["Bonnie Wright", "Ginny Weasley"],
      ["Matthew Lewis", "Neville Longbottom"], ["Michael Gambon", "Albus Dumbledore"],
    ],
  },
  {
    title: "Harry Potter and the Deathly Hallows: Part 1",
    year: 2010, rating: 7.7, director: "David Yates",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Daniel Radcliffe", "Harry Potter"], ["Rupert Grint", "Ron Weasley"],
      ["Emma Watson", "Hermione Granger"], ["Tom Felton", "Draco Malfoy"],
      ["Alan Rickman", "Severus Snape"], ["Robbie Coltrane", "Rubeus Hagrid"],
      ["Maggie Smith", "Minerva McGonagall"], ["Bonnie Wright", "Ginny Weasley"],
      ["Matthew Lewis", "Neville Longbottom"], ["Michael Gambon", "Albus Dumbledore"],
    ],
  },
  {
    title: "Harry Potter and the Deathly Hallows: Part 2",
    year: 2011, rating: 8.1, director: "David Yates",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Daniel Radcliffe", "Harry Potter"], ["Rupert Grint", "Ron Weasley"],
      ["Emma Watson", "Hermione Granger"], ["Tom Felton", "Draco Malfoy"],
      ["Alan Rickman", "Severus Snape"], ["Robbie Coltrane", "Rubeus Hagrid"],
      ["Maggie Smith", "Minerva McGonagall"], ["Bonnie Wright", "Ginny Weasley"],
      ["Matthew Lewis", "Neville Longbottom"], ["Michael Gambon", "Albus Dumbledore"],
    ],
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001, rating: 8.9, director: "Peter Jackson",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Elijah Wood", "Frodo Baggins"], ["Ian McKellen", "Gandalf"],
      ["Viggo Mortensen", "Aragorn"], ["Sean Astin", "Samwise Gamgee"],
      ["Orlando Bloom", "Legolas"], ["John Rhys-Davies", "Gimli"],
      ["Dominic Monaghan", "Meriadoc Brandybuck"], ["Billy Boyd", "Peregrin Took"],
      ["Cate Blanchett", "Galadriel"], ["Hugo Weaving", "Elrond"],
    ],
  },
  {
    title: "The Lord of the Rings: The Two Towers",
    year: 2002, rating: 8.8, director: "Peter Jackson",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Elijah Wood", "Frodo Baggins"], ["Ian McKellen", "Gandalf"],
      ["Viggo Mortensen", "Aragorn"], ["Sean Astin", "Samwise Gamgee"],
      ["Orlando Bloom", "Legolas"], ["John Rhys-Davies", "Gimli"],
      ["Dominic Monaghan", "Meriadoc Brandybuck"], ["Billy Boyd", "Peregrin Took"],
      ["Cate Blanchett", "Galadriel"], ["Hugo Weaving", "Elrond"],
    ],
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003, rating: 9.0, director: "Peter Jackson",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Elijah Wood", "Frodo Baggins"], ["Ian McKellen", "Gandalf"],
      ["Viggo Mortensen", "Aragorn"], ["Sean Astin", "Samwise Gamgee"],
      ["Orlando Bloom", "Legolas"], ["John Rhys-Davies", "Gimli"],
      ["Dominic Monaghan", "Meriadoc Brandybuck"], ["Billy Boyd", "Peregrin Took"],
      ["Cate Blanchett", "Galadriel"], ["Hugo Weaving", "Elrond"],
    ],
  },
  {
    title: "The Hobbit: An Unexpected Journey",
    year: 2012, rating: 7.8, director: "Peter Jackson",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Martin Freeman", "Bilbo Baggins"], ["Ian McKellen", "Gandalf"],
      ["Richard Armitage", "Thorin Oakenshield"], ["Ken Stott", "Balin"],
      ["Graham McTavish", "Dwalin"], ["Aidan Turner", "Kíli"],
      ["Dean O'Gorman", "Fíli"], ["Mark Hadlow", "Dori"],
      ["Jed Brophy", "Nori"], ["Adam Brown", "Ori"],
    ],
  },
  {
    title: "The Hobbit: The Desolation of Smaug",
    year: 2013, rating: 7.8, director: "Peter Jackson",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Martin Freeman", "Bilbo Baggins"], ["Ian McKellen", "Gandalf"],
      ["Richard Armitage", "Thorin Oakenshield"], ["Ken Stott", "Balin"],
      ["Graham McTavish", "Dwalin"], ["Aidan Turner", "Kíli"],
      ["Dean O'Gorman", "Fíli"], ["Mark Hadlow", "Dori"],
      ["Jed Brophy", "Nori"], ["Adam Brown", "Ori"],
    ],
  },
  {
    title: "The Hobbit: The Battle of the Five Armies",
    year: 2014, rating: 7.4, director: "Peter Jackson",
    genres: ["Adventure", "Fantasy"],
    cast: [
      ["Martin Freeman", "Bilbo Baggins"], ["Ian McKellen", "Gandalf"],
      ["Richard Armitage", "Thorin Oakenshield"], ["Ken Stott", "Balin"],
      ["Graham McTavish", "Dwalin"], ["Aidan Turner", "Kíli"],
      ["Dean O'Gorman", "Fíli"], ["Mark Hadlow", "Dori"],
      ["Jed Brophy", "Nori"], ["Adam Brown", "Ori"],
    ],
  },
  {
    title: "The Avengers",
    year: 2012, rating: 8.0, director: "Joss Whedon",
    genres: ["Action", "Adventure", "Science Fiction"],
    cast: [
      ["Robert Downey Jr.", "Tony Stark"], ["Chris Evans", "Steve Rogers"],
      ["Chris Hemsworth", "Thor"], ["Mark Ruffalo", "Bruce Banner"],
      ["Scarlett Johansson", "Natasha Romanoff"], ["Jeremy Renner", "Clint Barton"],
      ["Tom Hiddleston", "Loki"], ["Samuel L. Jackson", "Nick Fury"],
      ["Clark Gregg", "Phil Coulson"], ["Cobie Smulders", "Maria Hill"],
    ],
  },
  {
    title: "Avengers: Age of Ultron",
    year: 2015, rating: 7.3, director: "Joss Whedon",
    genres: ["Action", "Adventure", "Science Fiction"],
    cast: [
      ["Robert Downey Jr.", "Tony Stark"], ["Chris Evans", "Steve Rogers"],
      ["Chris Hemsworth", "Thor"], ["Mark Ruffalo", "Bruce Banner"],
      ["Scarlett Johansson", "Natasha Romanoff"], ["Jeremy Renner", "Clint Barton"],
      ["Elizabeth Olsen", "Wanda Maximoff"], ["Aaron Taylor-Johnson", "Pietro Maximoff"],
      ["Paul Bettany", "Vision"], ["James Spader", "Ultron"],
    ],
  },
  {
    title: "Avengers: Infinity War",
    year: 2018, rating: 8.4, director: "Anthony Russo and Joe Russo",
    genres: ["Action", "Adventure", "Science Fiction"],
    cast: [
      ["Robert Downey Jr.", "Tony Stark"], ["Chris Evans", "Steve Rogers"],
      ["Chris Hemsworth", "Thor"], ["Mark Ruffalo", "Bruce Banner"],
      ["Scarlett Johansson", "Natasha Romanoff"], ["Benedict Cumberbatch", "Doctor Strange"],
      ["Chadwick Boseman", "T'Challa"], ["Tom Holland", "Peter Parker"],
      ["Chris Pratt", "Peter Quill"], ["Josh Brolin", "Thanos"],
    ],
  },
  {
    title: "Avengers: Endgame",
    year: 2019, rating: 8.4, director: "Anthony Russo and Joe Russo",
    genres: ["Action", "Adventure", "Science Fiction"],
    cast: [
      ["Robert Downey Jr.", "Tony Stark"], ["Chris Evans", "Steve Rogers"],
      ["Chris Hemsworth", "Thor"], ["Mark Ruffalo", "Bruce Banner"],
      ["Scarlett Johansson", "Natasha Romanoff"], ["Jeremy Renner", "Clint Barton"],
      ["Paul Rudd", "Scott Lang"], ["Brie Larson", "Carol Danvers"],
      ["Don Cheadle", "James Rhodes"], ["Karen Gillan", "Nebula"],
    ],
  },
  {
    title: "Captain America: Civil War",
    year: 2016, rating: 7.8, director: "Anthony Russo and Joe Russo",
    genres: ["Action", "Adventure", "Science Fiction"],
    cast: [
      ["Robert Downey Jr.", "Tony Stark"], ["Chris Evans", "Steve Rogers"],
      ["Sebastian Stan", "Bucky Barnes"], ["Scarlett Johansson", "Natasha Romanoff"],
      ["Anthony Mackie", "Sam Wilson"], ["Don Cheadle", "James Rhodes"],
      ["Elizabeth Olsen", "Wanda Maximoff"], ["Paul Bettany", "Vision"],
      ["Chadwick Boseman", "T'Challa"], ["Tom Holland", "Peter Parker"],
    ],
  },
  {
    title: "Thor: Ragnarok",
    year: 2017, rating: 7.9, director: "Taika Waititi",
    genres: ["Action", "Adventure", "Fantasy"],
    cast: [
      ["Chris Hemsworth", "Thor"], ["Tom Hiddleston", "Loki"],
      ["Mark Ruffalo", "Bruce Banner"], ["Cate Blanchett", "Hela"],
      ["Tessa Thompson", "Valkyrie"], ["Jeff Goldblum", "Grandmaster"],
      ["Karl Urban", "Skurge"], ["Idris Elba", "Heimdall"],
      ["Benedict Cumberbatch", "Doctor Strange"], ["Anthony Hopkins", "Odin"],
    ],
  },
];

const movieId = (index) =>
  new Types.ObjectId(`6f11a7c00001${(index + 1).toString(16).padStart(12, "0")}`);
const actorId = (index) =>
  new Types.ObjectId(`6f11a7c00002${(index + 1).toString(16).padStart(12, "0")}`);
const castId = (index) =>
  new Types.ObjectId(`6f11a7c00003${(index + 1).toString(16).padStart(12, "0")}`);

const uniqueActorData = [
  ...new Map(actorData.map((entry) => [entry[0], entry])).values(),
];

const actors = uniqueActorData.map(([name, birthDate, nationality], index) => ({
  _id: actorId(index),
  name,
  birthDate: new Date(`${birthDate}T00:00:00.000Z`),
  nationality,
}));

const actorsByName = new Map(actors.map((actor) => [actor.name, actor]));
const movies = films.map((film, index) => ({
  _id: movieId(index),
  title: film.title,
  rating: film.rating,
  productYear: new Date(Date.UTC(film.year, 0, 1)),
  director: film.director,
  genres: film.genres,
}));

const cast = films.flatMap((film, filmIndex) =>
  film.cast.map(([name, characterName]) => {
    const actor = actorsByName.get(name);
    if (!actor) {
      throw new Error(`Missing actor data for ${name} in "${film.title}"`);
    }

    return {
      movie: movieId(filmIndex),
      actor: actor._id,
      characterName,
    };
  }),
);

const toUpserts = (documents) =>
  documents.map(({ _id, ...fields }) => ({
    updateOne: {
      filter: { _id },
      update: { $set: fields },
      upsert: true,
    },
  }));

try {
  if (films.length < 20 || films.some((film) => film.cast.length < 10)) {
    throw new Error("Seed data must contain at least 20 movies and 10 cast members per movie");
  }

  const movieIds = new Set(movies.map((movie) => movie._id.toString()));
  const actorIds = new Set(actors.map((actor) => actor._id.toString()));
  for (const entry of cast) {
    if (!movieIds.has(entry.movie.toString()) || !actorIds.has(entry.actor.toString())) {
      throw new Error("A cast record references a movie or actor that is not in the seed data");
    }
  }

  for (const document of [
    ...movies.map((movie) => new Movie(movie)),
    ...actors.map((actor) => new Actor(actor)),
    ...cast.map((entry) => new MovieCast(entry)),
  ]) {
    await document.validate();
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  const photoResponse = await fetch(
    `https://jsonplaceholder.typicode.com/photos?_start=0&_limit=${movies.length + actors.length}`,
  );
  if (!photoResponse.ok) {
    throw new Error(`JSONPlaceholder request failed with status ${photoResponse.status}`);
  }
  const photos = await photoResponse.json();
  if (!Array.isArray(photos) || photos.length < movies.length + actors.length) {
    throw new Error("JSONPlaceholder returned too few photo records");
  }

  movies.forEach((movie, index) => {
    movie.image = photos[index].url;
  });
  actors.forEach((actor, index) => {
    actor.image = photos[movies.length + index].url;
  });

  await connect(process.env.MONGO_URI);
  await Movie.bulkWrite(toUpserts(movies));
  await Actor.bulkWrite(toUpserts(actors));

  const castDocuments = cast.map((entry, index) => ({
    _id: castId(index),
    ...entry,
  }));
  await MovieCast.bulkWrite(toUpserts(castDocuments));

  const obsoleteActorIds = Array.from({ length: 200 - actors.length }, (_, index) =>
    actorId(actors.length + index),
  );
  if (obsoleteActorIds.length > 0) {
    await Actor.deleteMany({ _id: { $in: obsoleteActorIds } });
  }

  console.log(
    `Seed complete: ${movies.length} movies, ${actors.length} actors, and ${cast.length} cast links.`,
  );
} catch (error) {
  console.error("Failed to seed the database:", error);
  process.exitCode = 1;
} finally {
  await disconnect();
}
