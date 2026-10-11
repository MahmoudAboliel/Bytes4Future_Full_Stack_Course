import { type LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { forwardRef, useImperativeHandle, useState, type FC, type ReactElement, type ReactNode } from "react";

export type CustomDialogRef = {
  open: () => void;
  close: () => void;
};

interface DialogProps {
  Trigger: ReactElement;
  dialogTitle?: string;
  dialogDesc?: string;
  children: ReactNode;
}

const CustomDialog = forwardRef<CustomDialogRef, DialogProps>(
  ({ Trigger, dialogTitle, dialogDesc, children }, ref) => {

    const [open, setOpen] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
        close: () => setOpen(false)
    }));

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={Trigger} />
        <DialogContent>
          <DialogHeader>
            {dialogTitle && <DialogTitle>{dialogTitle}</DialogTitle>}
            {dialogDesc && <DialogDescription>{dialogDesc}</DialogDescription>}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  },
);

export default CustomDialog;
