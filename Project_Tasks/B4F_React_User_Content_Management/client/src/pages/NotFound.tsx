import { Button } from "@/components/ui/button"
import { pageMeta } from "@/lib/constants";

const NotFound = () => {
    const { title, description } = pageMeta.notFound;
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-73px)]">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        <Button className="mt-4 cursor-pointer" onClick={() => window.history.back()}>
          Go Back
        </Button>
    </div>
  )
}

export default NotFound