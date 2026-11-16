const presentations = {
  success: { icon: "✓", label: "Success", role: "status" },
  error: { icon: "!", label: "Error", role: "alert" },
  warning: { icon: "⚠", label: "Warning", role: "status" },
  info: { icon: "i", label: "Info", role: "status" },
};

export function getNotificationPresentation(type = "success") {
  return (
    presentations[type] || {
      ...presentations.info,
      label: "Notice",
    }
  );
}
