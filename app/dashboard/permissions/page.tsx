"use client";

import DeleteBtn from "@/components/delete-button";
import EditBtn, { BaseProperty } from "@/components/edit-button";
import ToastError from "@/components/toast-error";
import ToastSuccess from "@/components/toast-success";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreatePermission,
  DeletePermission,
  GetPermissions,
  UpdatePermission,
} from "@/lib/data-service";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PermissionFormValues {
  name: string;
  description: string;
}

interface Permission extends BaseProperty {
  name: string;
  description: string;
}

export default function PermissionPage() {
  const [open, setOpen] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<PermissionFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const data = await GetPermissions();
        setPermissions(data || []);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast.error("Failed to fetch permissions");
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, []);

  async function onSubmit(data: PermissionFormValues) {
    try {
      const response = await CreatePermission({
        name: data.name,
        description: data.description,
      });

      const { statusText,status } = response;
      form.reset();
      setOpen(false);

      if (status === 201) {
        ToastSuccess(statusText);
        // Refresh the permissions list
        const updatedPermissions = await GetPermissions();
        setPermissions(updatedPermissions || []);
      } else {
        ToastError(statusText);
      }
    } catch (error) {
      if (error instanceof Error) {
        ToastError(error.message);
      } else {
        ToastError("An unknown error occurred");
      }
    }
  }

  async function onEdit(data: PermissionFormValues, id: number) {
    try {
      const res = await UpdatePermission({
        id,
        name: data.name,
        description: data.description,
      });

      const { status, statusText } = res;
      form.reset();
      setOpen(false);

      if (status === 200) {
        ToastSuccess(statusText);
        setPermissions((permissions) =>
          permissions.map((p) =>
            p.id === id
              ? { ...p, name: res.data[0].name, description: res.data[0].description }
              : p
          )
        );
        return true;
      } else ToastError(statusText);
    } catch (error) {
      if (error instanceof Error) {
        ToastError(error.message);
      } else {
        ToastError("An unknown error occurred");
      }
      return false
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await DeletePermission(id);
      const { statusText, status } = res;
      if (status === 204) {
        ToastSuccess(statusText);
        setPermissions((permissions) => permissions.filter((p) => p.id !== id));
        return true;
      } else ToastError(statusText);
    } catch (error) {
      if (error instanceof Error) {
        ToastError(error.message);
      } else {
        ToastError("An unknown error occurred");
      }
      return false;
    }
  }

  return (
    <div className='px-6 py-2 w-full'>
      <div className='flex items-center justify-between mb-6'>
        <div className="flex gap-1 items-center">
          {/* <SidebarTrigger /> */}
          <h1 className='text-2xl font-bold'>Permission Management</h1>
        </div>
        <Dialog
          open={open}
          onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className='w-4 h-4 mr-2' />
              Add Permission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {form.getValues("name")
                  ? "Edit Permission"
                  : "Create New Permission"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                className='grid gap-4 py-4'
                onSubmit={form.handleSubmit((data) => {
                  const existingPermission = permissions.find(
                    (p) => p.name === form.getValues("name")
                  );
                  if (existingPermission) {
                    return onEdit(data, existingPermission.id);
                  }
                  return onSubmit(data);
                })}>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='grid gap-2'>
                      <FormLabel>Permission Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='e.g., read:users, write:posts'
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Describe what this permission allows'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name='module'
                  render={({ field }) => (
                    <FormItem className='grid gap-2'>
                      <FormLabel>Module</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='e.g., Users, Posts, Comments'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                /> */}
                <div className='flex justify-end gap-3'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type='submit'>
                    {form.getValues("name")
                      ? "Update Permission"
                      : "Create Permission"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permission Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center'>
                  Loading permissions...
                </TableCell>
              </TableRow>
            ) : permissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center'>
                  No permissions found. Create your first permission!
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className='font-medium'>
                    {permission.name}
                  </TableCell>
                  <TableCell>{permission.description}</TableCell>
                  <TableCell className='text-right'>
                    <EditBtn
                      type='permissions'
                      role={permission}
                      onSubmit={onEdit}
                    />
                    <DeleteBtn
                      title='permissions'
                      id={permission.id}
                      handleDelete={handleDelete}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
