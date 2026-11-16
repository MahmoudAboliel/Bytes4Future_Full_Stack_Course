import { AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

const TONE_ICON = {
  danger: AlertTriangle,
  primary: HelpCircle,
  success: CheckCircle2,
};

/**
 * Confirmation dialog built on Modal:
 *   <ConfirmDialog open onClose onConfirm title description confirmLabel tone />
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "تأكيد",
  tone = "primary",
}) => {
  const Icon = TONE_ICON[tone] || HelpCircle;
  const danger = tone === "danger";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            danger ? "bg-error-50 text-error-600" : "bg-brand-blue-soft text-brand-blue"
          }`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <p className="pt-1.5 text-sm leading-relaxed text-ink/80">
          {description}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
