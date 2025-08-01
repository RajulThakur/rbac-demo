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
import { useState } from "react";
export default function DeleteBtn({
  title,
  handleDelete,
  id,
}: {
  id: number;
  handleDelete: (id: number) => Promise<boolean | undefined>;
  title: string;
}) {
  const [open, setOpen] = useState(false);

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
          <DialogTitle>Do you want to delete {title}?</DialogTitle>
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
            onClick={async () => {
              const isSuccess = await handleDelete(id);
              if (isSuccess) setOpen(false);
            }}>
            <Trash className='w-4 h-4 mr-2' />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
