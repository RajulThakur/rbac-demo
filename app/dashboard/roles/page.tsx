"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RolesPage() {
  const [open, setOpen] = useState(false);

  // Example data - replace with your actual data fetching logic
  const roles = [
    { id: 1, name: "Admin", permissions: ["read", "write", "delete"] },
    { id: 2, name: "Editor", permissions: ["read", "write"] },
    { id: 3, name: "Viewer", permissions: ["read"] },
  ];

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
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Role Name</Label>
                <Input
                  id='name'
                  placeholder='Enter role name'
                />
              </div>
              {/* Add more form fields as needed */}
            </div>
            <div className='flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button>Create Role</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className='font-medium'>{role.name}</TableCell>
                <TableCell>
                  <div className='flex gap-1 flex-wrap'>
                    {role.permissions.map((permission) => (
                      <Badge
                        key={permission}
                        variant='secondary'>
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='ghost'
                    size='sm'>
                    Edit
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-red-600'>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
