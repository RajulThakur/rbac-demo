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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function PermissionPage() {
  const [open, setOpen] = useState(false);

  // Example data - replace with your actual data fetching logic
  const permissions = [
    {
      id: 1,
      name: "read:users",
      description: "Can view user information",
      module: "Users",
    },
    {
      id: 2,
      name: "write:users",
      description: "Can create and update users",
      module: "Users",
    },
    {
      id: 3,
      name: "delete:users",
      description: "Can delete users",
      module: "Users",
    },
    {
      id: 4,
      name: "read:roles",
      description: "Can view roles",
      module: "Roles",
    },
  ];

  return (
    <div className='p-6 w-full'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Permissions Management</h1>
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
              <DialogTitle>Create New Permission</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Permission Name</Label>
                <Input
                  id='name'
                  placeholder='e.g., read:users, write:posts'
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='description'>Description</Label>
                <Input
                  id='description'
                  placeholder='Describe what this permission allows'
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='module'>Module</Label>
                <Input
                  id='module'
                  placeholder='e.g., Users, Posts, Comments'
                />
              </div>
            </div>
            <div className='flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button>Create Permission</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permission Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Module</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell className='font-medium'>{permission.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
                <TableCell>
                  <Badge variant='secondary'>{permission.module}</Badge>
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
