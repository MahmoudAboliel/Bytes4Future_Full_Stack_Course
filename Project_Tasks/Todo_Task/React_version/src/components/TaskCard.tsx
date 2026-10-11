import type { Task } from "../utils/types";
import {
  CalendarCheck2,
  // CircleCheckBig,
  Cog,
  LaptopMinimalCheck,
  LayersArrowDown,
  PackageOpen,
  StepForward,
  // Trash,
  Users,
} from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Marker, MarkerContent, MarkerIcon } from "./ui/marker";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const TaskCard = ({
  // id,
  title,
  description,
  creatorId,
  status,
  priority,
  tags,
  assigneeIds,
  dueDate,
  createdAt,
}: Task) => {
  const tagColors = {
    red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    sky: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    green: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    purple:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    yellow:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300",
  };
  return (
    <Card
      className={`border border-l-4 ${priority === "low" ? "border-blue-400" : priority === "medium" ? "border-yellow-400" : "border-red-400"}`}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex gap-1">
          {tags.map((tag, i) => (
            <Badge
              key={tag}
              className={`px-2 py-2.5 ${Object.values(tagColors)[i % Object.keys(tagColors).length]}`}
              variant={"secondary"}
            >
              {tag}
            </Badge>
          ))}
        </CardDescription>
        <CardAction>
          <Cog
            color="gray"
            size={20}
            className="animate-spin animation-duration-2000"
          />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <Accordion defaultValue={["plans"]}>
          <AccordionItem>
            <AccordionTrigger>
              <Marker variant="separator">
                <MarkerContent>Details</MarkerContent>
              </Marker>
            </AccordionTrigger>
            <AccordionContent className="space-y-2 pb-0">
              <p>{description}</p>
              <div className="space-y-2">
                <Marker>
                  <MarkerIcon>
                    <Users />
                  </MarkerIcon>
                  <MarkerContent>Users Assignee</MarkerContent>
                </Marker>
                {assigneeIds.map((user) => {
                  return (
                    <div key={user.id} className="flex items-center gap-2">
                      <Avatar size="lg">
                        <AvatarImage loading="lazy" src={user.avatarUrl} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <h5>{user.name}</h5>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex gap-1">
          <Badge
            className={`px-2 py-2.5 ${status === "backlog" ? tagColors.blue : status === "in_progress" ? tagColors.green : tagColors.purple}`}
          >
            Status: {status}
          </Badge>
          <Badge
            className={`px-2 py-2.5 ${priority === "low" ? tagColors.sky : priority === "medium" ? tagColors.yellow : tagColors.red}`}
          >
            Priority: {priority}
          </Badge>
        </div>
        <Badge className={`px-2 py-3 ${tagColors.gray}`}>
          Due date:
          <CalendarCheck2 color="green" size={48} strokeWidth={2} />
          {new Date(dueDate).toDateString()}
        </Badge>
      </CardContent>
      <CardFooter className="p-2 flex justify-between">
        <div className="flex flex-col items-start p-2">
          <h5 className="text-sm">
            <span className="text-gray-500 text-xs">creator:</span>{" "}
            {creatorId.name}
          </h5>
          <p className="text-xs">
            <span className="text-gray-500">createdAt:</span>{" "}
            {new Date(createdAt).toDateString()}
          </p>
        </div>
        <div className="flex">
          {status === "backlog" ? (
            <StepForward
              color="green"
              size={18}
              className="animate-pulse animation-duration-700"
            />
          ) : status === "in_progress" ? (
            <LaptopMinimalCheck
              color="#607d8b"
              size={18}
              className="animate-pulse animation-duration-700"
            />
          ) : // <CircleCheckBig color="gray" size={16} />
          status === "done" ? (
            <LayersArrowDown
              color="#4527a0"
              size={18}
              className="animate-pulse animation-duration-700"
            />
          ) : (
            <PackageOpen
              color="#00838f"
              size={18}
              className="animate-pulse animation-duration-700"
            />
          )}
          {/* <Trash color="red" size={18} /> */}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
