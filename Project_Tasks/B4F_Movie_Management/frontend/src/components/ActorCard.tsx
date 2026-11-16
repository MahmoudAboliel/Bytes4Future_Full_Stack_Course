
import { Actor } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { ArrowUpIcon, Eye } from "lucide-react";

interface ActorCardProps {
  actor: Actor;
}

const ActorCard = ({ actor }: ActorCardProps) => {
  return (
    <Card key={actor._id} className="relative mx-auto w-full max-w-sm pt-0 ">
      <div className="absolute inset-0 z-30 aspect-video bg-black/0" />
      <Image
        src={actor.image}
        loading="lazy"
        width={400}
        height={225}
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardTitle className="text-2xl">{actor.name}</CardTitle>
        <CardDescription className="">
          Birth Date: <span className="text-gray-900">{new Date(actor.birthDate).toDateString()}</span>
          <br />
          Nationality:{" "}
          <span className="text-gray-900">{actor.nationality}</span>
        </CardDescription>
      </CardHeader>
      {/* <CardFooter className="flex flex-wrap p-2 gap-1">
        <Button variant="outline" size="icon" aria-label="Submit">
          <Eye />
        </Button>
        <Button variant="outline" size="icon" aria-label="Submit">
          <Eye />
        </Button>
        <Button variant="outline" size="icon" aria-label="Submit">
          <Eye />
        </Button>
      </CardFooter> */}
    </Card>
  );
}

export default ActorCard