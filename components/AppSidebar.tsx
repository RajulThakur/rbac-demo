import { Shield, User, UserSquare2, KeyRound, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ThemeSwitcher } from "./theme-switcher";

interface AppSidebarProps {
  user: SupabaseUser;
}

// Menu items for RBAC
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Shield,
  },
  {
    title: "Users",
    url: "/dashboard/user",
    icon: User,
  },
  {
    title: "Roles",
    url: "/dashboard/roles",
    icon: UserSquare2,
  },
  {
    title: "Permissions",
    url: "/dashboard/permissions",
    icon: KeyRound,
  },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await createClient().auth.signOut();
      if (error) {
        throw error;
      }
      router.push("/auth");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <Sidebar className='fixed inset-y-0 w-auto left-0 z-50 flex h-full flex-col border-r bg-card'>
      <SidebarHeader className='p-4 border-b'>
        <div className='flex items-center space-x-2'>
          <Shield className='h-6 w-6 text-primary' />
          <h1 className='text-xl font-bold'>RBAC Tool</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className='flex-1 overflow-auto'>
        <SidebarGroup>
          <SidebarGroupLabel className='px-2 py-4'>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent'>
                      <item.icon className='h-4 w-4' />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='mt-auto border-t p-4'>
        <div className='flex flex-col space-y-4'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-9 w-9'>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='text-sm font-medium leading-none'>
                {user?.email}
              </span>
            </div>
          </div>
          <Separator />
          <div className='flex items-center justify-between'>
            <ThemeSwitcher />
            <Button
              variant='ghost'
              size='icon'
              onClick={handleSignOut}
              className='hover:bg-accent'>
              <LogOut className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
