"use client";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import ToastError from "@/components/toast-error";
import ToastSuccess from "@/components/toast-success";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export interface Roles {
  id: number;
  name: string;
  permissions: string[];
  description?: string;
}

export interface RoleFormValues {
  role: string;
  desc: string;
}

import { CreateRole, GetRoles } from "@/lib/data-service";
import { useEffect } from "react";
import { toast } from "sonner";
import EditBtn from "@/components/edit-button";
import DeleteBtn from "@/components/delete-button";

export default function RolesPage() {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState<Roles[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const data = await GetRoles();
        setRoles(data || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles");
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, []);

  const form = useForm<RoleFormValues>({
    defaultValues: {
      role: "",
      desc: "",
    },
  });

  async function onSubmit(data: RoleFormValues) {
    try {
      const res = await CreateRole({ name: data.role, description: data.desc });
      const { statusText } = res;
      console.log("response", res);
      form.reset();
      setOpen(false);
      if (statusText === "Created") {
        ToastSuccess(statusText);
        console.log(res.data);
        setRoles((role) => [...role, ...res.data]);
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
    <div className='p-6 w-full'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Roles Management</h1>
        <Dialog
          open={open}
          onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className='w-4 h-4 mr-2' />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
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
                  <Button type='submit'>Create Role</Button>
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
              <TableHead>Role Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className='text-center'>
                  Loading roles...
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className='text-center'>
                  No roles found. Create your first role!
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className='font-medium'>{role.name}</TableCell>
                  <TableCell>
                    <div className='flex gap-1 flex-wrap'>
                      {role.permissions?.map((permission) => (
                        <Badge
                          key={permission}
                          variant='secondary'>
                          {permission}
                        </Badge>
                      )) || "No permissions assigned"}
                    </div>
                  </TableCell>
                  <TableCell className='font-light'>
                    {role.description || ""}
                  </TableCell>
                  <TableCell className='text-right'>
                    <EditBtn
                      role={role}
                      setRoles={setRoles}
                    />
                    <DeleteBtn
                      roleName={role.name}
                      setRoles={setRoles}
                      id={role.id}
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
