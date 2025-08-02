"use client";

import ToastError from "@/components/toast-error";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateUser, GetRoles, GetUsers, Role, User } from "@/lib/data-service";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserPage() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await GetUsers();
      setUsers(data);
      console.log(`user-`,data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await GetRoles();
      setRoles(data);
      console.log(`roles-`,data);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (
        !formData.first_name ||
        !formData.last_name ||
        !formData.email ||
        !selectedRole
      ) {
        throw new Error("Please fill in all fields");
      }

      await CreateUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        role_id: parseInt(selectedRole),
      });

      setFormData({ first_name: "", last_name: "", email: "" });
      setSelectedRole("");
      setOpen(false);
      await loadUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof Error) {
        ToastError(error.message);
      } else ToastError("Unnable to create User");
    }
  };

  return (
    <div className='px-6 py-2 w-full'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex gap-1 items-center'>
          <h1 className='text-2xl font-bold'>User Management</h1>
        </div>
        <Dialog
          open={open}
          onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className='w-4 h-4 mr-2' />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  placeholder='Enter first name'
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  placeholder='Enter last name'
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter email address'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='role'>Role</Label>
                <Select
                  value={selectedRole}
                  onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem
                        key={role.id}
                        value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => {
                  setOpen(false);
                  setFormData({ first_name: "", last_name: "", email: "" });
                  setSelectedRole("");
                }}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateUser}
                disabled={
                  !formData.first_name ||
                  !formData.last_name ||
                  !formData.email ||
                  !selectedRole
                }>
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='border rounded-lg'>
        {loading ? (
          <div className='p-8 text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-muted-foreground'>Loading users...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Details</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.first_name}${user.last_name}`}
                        alt={`${user.first_name} ${user.last_name}`}
                      />
                      <AvatarFallback>
                        {user.first_name[0]}
                        {user.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='font-medium'>
                        {user.first_name} {user.last_name}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        Created:{" "}
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role && (
                      <Badge variant='secondary'>{user.role.name}</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
