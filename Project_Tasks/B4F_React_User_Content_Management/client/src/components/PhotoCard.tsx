import type { Photo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { photosApi } from "@/services/api";
import { DynamicForm } from "@/lib/dynamic-form/DynamicForm";
import { useRef, type Dispatch, type SetStateAction } from "react";
import CustomDialog, { type CustomDialogRef } from "./CustomDialog";

const PhotoCard = ({
  id,
  albumId,
  title,
  url,
  thumbnailUrl,
  setUpdate,
}: Photo & { setUpdate: Dispatch<SetStateAction<boolean>> }) => {
  const ref = useRef<CustomDialogRef>(null);

  return (
    <div
      id={`photo-${albumId}-${id}`}
      className="flex flex-col w-full p-3 h-80 border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-full h-48 bg-gray-100 shrink">
        <img
          src={url ?? thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover rounded-md"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col justify-between gap-2 flex-1 pt-3">
        <p
          className="text-xs font-medium text-gray-800 line-clamp-2"
          title={title}
        >
          {title}
        </p>
        <div className="flex gap-2">
          <CustomDialog
            Trigger={
              <Button variant="secondary" className='flex-2'>
                update
              </Button>
            }
            dialogTitle="Update Photo"
            dialogDesc="Edit your photo title"
            ref={ref}
          >
            <DynamicForm
              fields={[
                {
                  name: "title",
                  label: "Photo Title",
                  type: "text",
                  required: false,
                },
              ]}
              defaultValues={{ title }}
              onSubmit={async (data: Record<string, unknown>) => {
                await photosApi.update(id, data);
                setUpdate((prev) => !prev);
                ref.current?.close();
              }}
              submitLabel="edit"
              columns={1}
            />
          </CustomDialog>
          <Button
            className="flex-1"
            variant={"destructive"}
            onClick={async () => {
              await photosApi.delete(id);
              setUpdate((prev) => !prev);
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
