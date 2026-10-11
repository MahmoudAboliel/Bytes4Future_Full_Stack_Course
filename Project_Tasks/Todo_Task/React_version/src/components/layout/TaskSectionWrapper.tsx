import {
  Card,
  // CardAction,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";
import { Separator } from "../ui/separator";

interface TaskSectionProps {
  title: string;
  children: ReactNode;
}
const TaskSectionWrapper = ({ title, children }: TaskSectionProps) => {
  return (
    <Card className="h-full overflow-y-auto w-[350px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-3 mb-2">{children}</CardContent>
    </Card>
  );
};

export default TaskSectionWrapper;
