"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Permission {
  id: number;
  name: string;
  description?: string;
}

interface PermissionCheckboxesProps {
  permissions: Permission[];
  selectedPermissions?: number[];
  onPermissionChange: (selectedIds: number[]) => void;
  className?: string;
}

export function PermissionCheckboxes({
  permissions,
  selectedPermissions = [],
  onPermissionChange,
  className,
}: PermissionCheckboxesProps) {
  const [selected, setSelected] = useState<number[]>(selectedPermissions);

  const togglePermission = (permissionId: number) => {
    const updatedSelection = selected.includes(permissionId)
      ? selected.filter((id) => id !== permissionId)
      : [...selected, permissionId];

    setSelected(updatedSelection);
    onPermissionChange(updatedSelection);
  };

  const selectAll = () => {
    const allIds = permissions.map((p) => p.id);
    setSelected(allIds);
    onPermissionChange(allIds);
  };

  const clearAll = () => {
    setSelected([]);
    onPermissionChange([]);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className='flex justify-between items-center'>
        <h4 className='text-sm font-medium leading-none'>Permissions</h4>
        <div className='space-x-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={selectAll}>
            Select All
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={clearAll}>
            Clear
          </Button>
        </div>
      </div>
      <ScrollArea className='h-[200px] rounded-md border p-4'>
        <div className='space-y-4'>
          {permissions.map((permission) => (
            <div
              key={permission.id}
              className='flex items-start space-x-3 space-y-0'>
              <Checkbox
                checked={selected.includes(permission.id)}
                onCheckedChange={() => togglePermission(permission.id)}
              />
              <div className='space-y-1'>
                <label
                  htmlFor={`permission-${permission.id}`}
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                  {permission.name}
                </label>
                {permission.description && (
                  <p className='text-sm text-muted-foreground'>
                    {permission.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className='text-sm text-muted-foreground'>
        {selected.length} permission{selected.length !== 1 && "s"} selected
      </div>
    </div>
  );
}
