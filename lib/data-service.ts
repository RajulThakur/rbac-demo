"use server";
import { createClient } from "./supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const getAdminClient = () => {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

// Types for roles and permissions
interface Permission {
  id: number;
  name: string;
  description?: string;
}

interface RolePermission {
  permissions: Permission;
}

interface Role {
  id: number;
  name: string;
  description?: string;
  role_permissions?: RolePermission[];
  permissions?: Permission[];
}

//Crud permissions
export async function GetPermissions() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("permissions").select("*");
  if (error) {
    throw new Error("Failed to fetch permissions");
  }
  return data;
}

export async function UpdatePermission(permission: {
  id: number;
  name: string;
  description: string;
}) {
  const supabase = await createClient();
  const { data, error, status, statusText } = await supabase
    .from("permissions")
    .update({
      name: permission.name,
      description: permission.description,
    })
    .eq("id", permission.id)
    .select();

  if (error) {
    console.error("Error updating permission:", error);
    throw new Error(error.message);
  }

  return { data, status, statusText };
}

export async function DeletePermission(id: number) {
  const supabase = await createClient();
  const { error, status, statusText } = await supabase
    .from("permissions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting permission:", error);
    throw new Error(error.message);
  }

  return { status, statusText };
}

export async function CreatePermission(permission: {
  name: string;
  description: string;
}) {
  const supabase = await createClient();
  const { data, error, statusText, status } = await supabase
    .from("permissions")
    .insert([permission]);
  if (error) {
    throw new Error("Failed to create permission");
  }
  return { data, statusText, status };
}

//Crud roles
export async function GetRoles() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("roles").select(`
      *,
      role_permissions!role_permissions_role_id_fkey (
        permissions:permissions_id (
          id,
          name,
          description
        )
      )
    `);
  if (error) {
    throw new Error("Failed to fetch roles");
  }

  // Transform the data to flatten the permissions array
  return data.map((role: Role) => ({
    ...role,
    permissions:
      role.role_permissions?.map((rp: RolePermission) => rp.permissions) || [],
  }));
}

export async function CreateRole(role: {
  name: string;
  description: string;
  permission_ids: number[]; // Array of permission IDs to assign
}) {
  const supabase = await createClient();

  // Start a transaction by using single batch
  const { data, error: roleError } = await supabase
    .from("roles")
    .insert([
      {
        name: role.name,
        description: role.description,
      },
    ])
    .select()
    .single();

  if (roleError) {
    console.error("Error creating role:", roleError);
    throw new Error(roleError.message);
  }

  // Create permission associations
  const permissionAssociations = role.permission_ids.map((permission_id) => ({
    role_id: data.id,
    permissions_id: permission_id,
  }));

  const { error: permError } = await supabase
    .from("role_permissions")
    .insert(permissionAssociations);

  if (permError) {
    console.error("Error assigning permissions:", permError);
    throw new Error("Failed to assign permissions to role");
  }

  // Fetch the complete role with permissions
  const { data: roleWithPerms, error: fetchError } = await supabase
    .from("roles")
    .select(
      `
      *,
      role_permissions!role_permissions_role_id_fkey (
        permissions:permissions_id (
          id,
          name,
          description
        )
      )
    `
    )
    .eq("id", data.id)
    .single();

  if (fetchError) {
    throw new Error("Failed to fetch role details");
  }

  return {
    data: {
      ...roleWithPerms,
      permissions:
        roleWithPerms.role_permissions?.map(
          (rp: RolePermission) => rp.permissions
        ) || [],
    },
    status: 201,
    statusText: "Created",
  };
}

export async function DeleteRole(id: number) {
  const supabase = await createClient();

  // First delete the role_permissions associations
  const { error: permError } = await supabase
    .from("role_permissions")
    .delete()
    .eq("role_id", id);

  if (permError) {
    console.error("Error deleting role permissions:", permError);
    throw new Error("Failed to delete role permissions");
  }

  // Then delete the role
  const { error, status, statusText } = await supabase
    .from("roles")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting role:", error);
    throw new Error("Failed to delete role");
  }

  return { status, statusText };
}

export async function UpdateRole(role: {
  id: number;
  name: string;
  description?: string;
  permission_ids?: number[]; // Optional array of permission IDs
}) {
  const supabase = await createClient();

  // Update role basic info
  const { error: roleError } = await supabase
    .from("roles")
    .update({
      description: role.description,
      name: role.name,
    })
    .eq("id", role.id);

  if (roleError) {
    console.error("Error updating role:", roleError);
    throw new Error(roleError.message || "Failed to update role");
  }

  // If permission_ids is provided, update permissions
  if (role.permission_ids) {
    // Delete existing permissions
    await supabase.from("role_permissions").delete().eq("role_id", role.id);

    // Insert new permissions
    const permissionAssociations = role.permission_ids.map((permission_id) => ({
      role_id: role.id,
      permissions_id: permission_id,
    }));

    const { error: permError } = await supabase
      .from("role_permissions")
      .insert(permissionAssociations);

    if (permError) {
      console.error("Error updating permissions:", permError);
      throw new Error("Failed to update role permissions");
    }
  }

  // Fetch updated role with permissions
  const { data, error: fetchError } = await supabase
    .from("roles")
    .select(
      `
      *,
      role_permissions!role_permissions_role_id_fkey (
        permissions:permissions_id (
          id,
          name,
          description
        )
      )
    `
    )
    .eq("id", role.id)
    .single();

  if (fetchError) {
    throw new Error("Failed to fetch updated role");
  }

  return {
    data: {
      ...data,
      permissions:
        data.role_permissions?.map((rp: RolePermission) => rp.permissions) ||
        [],
    },
    status: 200,
    statusText: "OK",
  };
}

// User management functions
export async function GetUsers() {
  const supabase = getAdminClient();
  const { data: authUsers, error: authError } =
    await supabase.auth.admin.listUsers();

  if (authError) {
    console.error("Error fetching auth users:", authError);
    throw new Error("Failed to fetch users");
  }

  // Get user roles from the junction table
  const { data: userRoles, error: rolesError } = await supabase.from(
    "user_roles"
  ).select(`
      user_id,
      roles:roles_id (
        id,
        name,
        description
      )
    `);

  if (rolesError) {
    console.error("Error fetching user roles:", rolesError);
    throw new Error("Failed to fetch user roles");
  }

  // Combine auth users with their roles and flatten user metadata
  const combinedUsers = authUsers.users.map((authUser) => {
    const userRole = userRoles?.find((ur) => ur.user_id === authUser.id);
    return {
      ...authUser,
      first_name: authUser.user_metadata?.first_name || "",
      last_name: authUser.user_metadata?.last_name || "",
      role: userRole?.roles,
    };
  });

  return combinedUsers;
}

export async function CreateUser(userData: {
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
}) {
  const supabase = getAdminClient();

  // First, create the auth user
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: userData.email,
      email_confirm: true,
      user_metadata: {
        first_name: userData.first_name,
        last_name: userData.last_name,
      },
    });

  if (authError) {
    console.error("Error creating user auth:", authError);
    throw new Error(authError.message);
  }

  // Then create the user role association
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .insert([
      {
        user_id: authData.user.id,
        roles_id: userData.role_id,
      },
    ]).select(`
      roles:roles_id (
        id,
        name,
        description
      )
    `);

  if (roleError) {
    console.error("Error assigning user role:", roleError);
    throw new Error("Failed to assign user role");
  }

  // Return combined user data
  return {
    ...authData.user,
    role: roleData?.[0]?.roles,
  };
}
