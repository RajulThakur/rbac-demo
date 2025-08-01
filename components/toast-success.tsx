import { toast } from "sonner";

export default function ToastSuccess(message: string) {
  toast("Success", {
    description: message || "Action is perform successfully",
  });
}
