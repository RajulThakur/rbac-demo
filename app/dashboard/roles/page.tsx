"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreateRole,
  DeleteRole,
  GetPermissions,
  GetRoles,
  Role,
  UpdateRole,
} from "@/lib/data-service";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import { useEffect, useState } from "react";

// (Interfaces for Permission and Role remain the same)
interface Permission {
  id: number;
  name: string;
  description?: string;
}

export default function RolePage() {
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  // Data states
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  // Form and selection states
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const isEditing = !!editingRole;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [rolesData, permissionsData] = await Promise.all([
        GetRoles(),
        GetPermissions(),
      ]);
      console.log(rolesData);
      setRoles(rolesData);
      setAllPermissions(permissionsData);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setSelectedPermissions([]);
    setEditingRole(null);
  };

  // --- NEW HANDLERS ---
  const handleAddNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({ name: role.name, description: role.description || "" });
    setSelectedPermissions(role.role_permissions?.map((p) => p.id) || []);
    setDialogOpen(true);
  };

  const handleDeleteInitiate = (role: Role) => {
    setRoleToDelete(role);
    setAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;
    try {
      await DeleteRole(roleToDelete.id);
      await loadInitialData(); // Refresh list
    } catch (error) {
      console.error("Failed to delete role", error);
    } finally {
      setAlertOpen(false);
      setRoleToDelete(null);
    }
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked
        ? [...prev, permissionId]
        : prev.filter((id) => id !== permissionId)
    );
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        // Update existing role
        await UpdateRole({
          id: editingRole.id,
          ...formData,
          permission_ids: selectedPermissions,
        });
      } else {
        // Create new role
        await CreateRole({
          ...formData,
          permission_ids: selectedPermissions,
        });
      }
      setDialogOpen(false);
      await loadInitialData();
    } catch (error) {
      console.error("Failed to save role:", error);
    }
  };

  return (
    <div className='px-6 py-2 w-full'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Role Management</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className='w-4 h-4 mr-2' />
          Add Role
        </Button>
      </div>

      {/* --- MAIN DIALOG FOR CREATE/EDIT --- */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setDialogOpen(open);
        }}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Role" : "Create New Role"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? `Update the details for the "${editingRole.name}" role.`
                : "Define a new role and assign permissions."}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            {/* Form fields */}
            <div className='grid gap-2'>
              <Label htmlFor='roleName'>Role Name</Label>
              <Input
                id='roleName'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='roleDescription'>Description</Label>
              <Input
                id='roleDescription'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className='grid gap-2'>
              <Label>Permissions</Label>
              <div className='grid gap-2 rounded-md border p-4 max-h-48 overflow-y-auto'>
                {allPermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className='flex items-center space-x-2'>
                    <Checkbox
                      id={`perm-${permission.id}`}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(permission.id, !!checked)
                      }
                    />
                    <Label
                      htmlFor={`perm-${permission.id}`}
                      className='font-normal'>
                      {permission.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.name ||
                !formData.description ||
                selectedPermissions.length === 0
              }>
              {isEditing ? "Save Changes" : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <AlertDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <strong>{roleToDelete?.name}</strong> role and remove it from all
              users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- ROLES TABLE --- */}
      <div className='border rounded-lg'>
        {loading ? (
          <div className='p-8 text-center'>{/* Loading spinner */}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className='font-medium'>{role.name}</div>
                    <div className='text-sm text-muted-foreground'>
                      {role.description || ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-wrap gap-1'>
                      {role.role_permissions?.map((perm) => (
                        <Badge
                          key={perm.id}
                          variant='secondary'>
                          {perm.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          className='h-8 w-8 p-0'>
                          <span className='sr-only'>Open menu</span>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(role)}>
                          <Edit className='mr-2 h-4 w-4' />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-red-600'
                          onClick={() => handleDeleteInitiate(role)}>
                          <Trash2 className='mr-2 h-4 w-4' />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
