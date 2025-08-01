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
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { RoleFormValues, Roles } from "@/app/dashboard/roles/page";
import ToastError from "./toast-error";
import ToastSuccess from "./toast-success";
import { UpdateRole } from "@/lib/data-service";
export default function EditBtn({
  role,
  setRoles,
}: {
  role: Roles;
  setRoles: Dispatch<SetStateAction<Roles[]>>;
}) {
  const [open, setOpen] = useState(false);
  const { name, description, id } = role;
  const form = useForm<RoleFormValues>();
  async function onSubmit(data: RoleFormValues) {
    try {
      const res = await UpdateRole({
        id,
        name: data.role,
        description: data.desc,
      });
      const { status, statusText } = res;
      console.log("response", res);
      form.reset();
      setOpen(false);
      if (status === 200) {
        ToastSuccess(statusText);
        console.log(res.data);
        setRoles((roles) =>
          roles.map((r) =>
            r.id === id ? { ...r, name: res.data[0].name, description: data.desc } : r
          )
        );
      } else ToastError(statusText);
    } catch (error) {
      if (error instanceof Error) {
        ToastError(error.message);
      } else {
        ToastError("An unknown error occurred");
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
          size='sm'>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role:{name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='grid gap-4 py-4'
            onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel htmlFor='role'>Role Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      defaultValue={name}
                      placeholder='Enter role name'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='desc'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel htmlFor='desc'>Description of Role</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      defaultValue={description}
                      placeholder='Describe role'
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
              <Button type='submit'>Update Role</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
