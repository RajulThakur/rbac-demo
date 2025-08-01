"use client";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const {
      data: { subscription },
    } = createClient().auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.push("/auth");
      }
      setLoading(false);
    });

    createClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          router.push("/auth");
        }
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, [router]);
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <SidebarProvider>
      <div className='min-h-screen w-full'>
        <AppSidebar user={user} />
        <main className='md:pl-80 w-full'>
          <div className='container mx-auto'>{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
