import ActorCard from "@/components/ActorCard";
import { api, fetcher } from "@/lib/apis";
import { Actor } from "@/lib/types";

const ActorPage = async () => {
  "use cache";
  const actors = await fetcher<Actor[]>(api.getActors);
  console.log(actors[0])
  return (
    <div>
      <h2 className="text-xl font-semibold">Total Actors: {actors.length}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {actors.map((actor: Actor) => (
          <ActorCard key={actor._id} actor={actor} />
        ))}
      </div>
    </div>
  );
};

export default ActorPage;
