"use client";
import { Button } from "@/components/ui/button";
import { Dialog } from "@radix-ui/react-dialog";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Roles } from "@/app/dashboard/roles/page";
import { DeleteRole } from "@/lib/data-service";
import ToastSuccess from "./toast-success";
import ToastError from "./toast-error";
export default function DeleteBtn({
  roleName,
  id,
  setRoles,
}: {
  id: number;
  roleName: string;
  setRoles: Dispatch<SetStateAction<Roles[]>>;
}) {
  const [open, setOpen] = useState(false);
  async function handleDelete() {
    try {
      const res = await DeleteRole(id);
      const { statusText, status } = res;
      console.log("response", res);
      setOpen(false);
      if (status === 204) {
        ToastSuccess(statusText);
        console.log(res.data);
        setRoles((roles) => roles.filter((r) => r.id !== id));
      } else ToastError(statusText);
    } catch (error) {
      if (error instanceof Error) {
        ToastError(error.message);
      } else {
        ToastError('An unknown error occurred');
      }
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='text-red-600'>
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you want to delete role:{roleName}?</DialogTitle>
        </DialogHeader>
        <div className='flex justify-end gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type='submit'
            onClick={handleDelete}>
            <Trash className='w-4 h-4 mr-2' />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
