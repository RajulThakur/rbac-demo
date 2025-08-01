"use server";
import { createClient } from "./supabase/server";

export async function GetRoles() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("roles").select("*");
  if (error) {
    throw new Error("Failed to fetch roles");
  }
  return data;
}
export async function GetPermissions() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("permissions").select("*");
  if (error) {
    throw new Error("Failed to fetch permissions");
  }
  return data;
}

export async function GetUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    throw new Error("Failed to fetch users");
  }
  return data;
}

//done
export async function CreateRole(role: { name: string; description: string }) {
  const supabase = await createClient();
  const { statusText, error, data } = await supabase
    .from("roles")
    .insert([role])
    .select("*");
  console.log("Role creation response:", statusText, data);
  if (error) {
    console.error("Error creating role:", error);
    throw new Error(error.message);
  }
  return { data, statusText };
}
export async function DeleteRole(id: number) {
  const supabase = await createClient();
  const { data, error, statusText, status } = await supabase
    .from("roles")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("Error deleting role:", error);
    throw new Error("Failed to delete role");
  }
  return { data, statusText, status };
}
export async function UpdateRole(role: {
  id: number;
  name: string;
  description?: string;
}) {
  const supabase = await createClient();
  const { statusText, data, error, status } = await supabase
    .from("roles")
    .update({ description: role.description, name: role.name })
    .eq("id", role.id)
    .select("*");
  if (error) {
    console.error("Error updating role:", error);
    throw new Error(error.message || "Failed to update role");
  }
  return { data, statusText, status };
}

export async function CreatePermission(permission: {
  name: string;
  description: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("permissions")
    .insert([permission]);
  if (error) {
    throw new Error("Failed to create permission");
  }
  return data;
}
