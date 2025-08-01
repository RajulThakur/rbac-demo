import { toast } from "sonner";

export default function ToastError(errorMsg: string) {
  toast("Error", {
    description: errorMsg || "An unexpected error occurred",
  });
}
