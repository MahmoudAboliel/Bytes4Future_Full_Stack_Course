import { Movie } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardAction,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Card key={movie._id} className="relative mx-auto w-full max-w-sm pt-0 ">
      <div className="absolute inset-0 z-30 aspect-video bg-black/0" />
      <Image
        src={movie.image}
        loading="lazy"
        width={400}
        height={225}
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardAction className="flex flex-wrap pl-3 gap-2">
        {movie.genres.map((genre) => (
          <Badge key={genre} variant="secondary" className="text-sm">
            {genre}
          </Badge>
        ))}
      </CardAction>
      <CardHeader>
        <CardTitle className="text-2xl">{movie.title}</CardTitle>
        <CardDescription className="">
          Directed by: <span className="text-gray-900">{movie.director}</span>
          <br />
          Released in:{" "}
          <span className="text-gray-900">
            {new Date(movie.productYear).toDateString()}
          </span>
          <br />
          Rating: <span className="text-gray-900">{movie.rating}</span>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
