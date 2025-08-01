/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Dialog } from "@radix-ui/react-dialog";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";

export interface BaseProperty{
  id:number;
  name:string;
  description?: string;
}
export default function EditBtn({
  type,
  role,
  onSubmit,
}: {
  type:string
  role: BaseProperty;
  onSubmit: (data: any, id: number) => Promise<boolean | undefined>;
}) {
  const [open, setOpen] = useState(false);
  const { name, description, id } = role;
  const form = useForm<any>();

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {type}:{name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='grid gap-4 py-4'
            onSubmit={form.handleSubmit(async (data) => {
              const isSuccess=await onSubmit(data, id);
              if(isSuccess) setOpen(false)
            })}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel htmlFor={type}>{type} Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      defaultValue={name}
                      placeholder={`Enter ${type} name`}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel htmlFor='desc'>Description of {type}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      defaultValue={description}
                      placeholder='Describe {type}'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='flex justify-end gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type='submit'>Update</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
